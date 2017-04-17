/**
 * Middleware takes in the information from the frontend (i.e. which checkboxes selected)
 * parses through the entire HTML DOM, assigning and modifying internal values as needed,
 * and that information is then packaged and sent to the backend so the output files can
 * be written.
 */

//===================================== Inner Helper Data Structures =====================================

/**
 * Wrapper class for DOM elements, with helper methods (primarily toJSON).
 */
class Element {

    //no constructor overloading, hence the setData() method
    constructor(doc_element) {
        this.doc_element = doc_element; //HTMLCollection
        this.parsed = false;
        this.elemEnumType = null;
        this.fullhtml = null;
        this.clazz = null;
        this.tag = null;
        this.name = null;
        this.title = null;
        this.id = null;
        this.xpath = null;
        this.description = null;
        this.descriptiveName = null;
        this.hasDescriptiveName = false;
    }

    // Helper method for quickly instantiating a lot of data
    setData(fullhtml, clazz, tag, name, id, xPath) {
        this.fullhtml = fullhtml;
        this.clazz = clazz;
        this.tag = tag;
        this.name = name;
        this.id = id;
        this.xpath = xPath;
    }

    /**
     * Helper method for serializing the data to send to the backend.
     *
     * @returns {{hasDescriptiveName: (*|boolean), descriptiveName: (null|*), fullHTML: (null|*), type: (null|*), class: (*|null), id: (null|*), name: (*|null), xpath: (null|*)}}
     */
    toJSON() {
        return {
            'hasDescriptiveName': this.hasDescriptiveName,
            'descriptiveName': this.descriptiveName,
            // 'fullHTML': this.fullhtml,
            'type': this.elemEnumType,
            'class': this.clazz,
            // 'Tag': this.tag,
            'id': this.id,
            'name': this.name,
            'xpath': this.xpath
        };
    }

    /**
     * To easily set parsing status to know if it has been analyzed already
     */
    setParsed() {
        if (!this.parsed) this.parsed = true;
    }

    /**
     * To allow checking of parsing status to know if it has been analyzed already
     *
     * @returns {boolean} - this.parsed
     */
    isParsedAlready() {
        return this.parsed;
    }

    /**
     * Helper method for simple stringification
     */
    toString() {
        return "Element " + "\nID: " + this.id + "\nName: " + this.name;
    }

}


/**
 * Enum to hold the multiple varieties of element types.
 *
 * @type {Object}
 */
ElementTypeEnum = Object.freeze({
    BUTTON: "Button",
    LINK: "Link",
    INPUT: "Input",
    ONCLICK: "JavaScript (on-click)", //ToDo: What to name it exactly?
    NGCLICK: "Angular (ng-click)"
});


//=================================================== Main Logic ===========================================================


// Variables used to hold the most important pieces of data
let elementsToBeParsedCheckboxes = []; // The UI checkboxes selected from the frontend
let elementObjects = []; // The Elements parsed, to be sent to the backend

// The main code loop
chrome.runtime.onMessage.addListener(

    function(message, sender, sendResponse) {

        if (message.checkboxData) {

            // Read message and assign passed in data from the frontend.
            elementsToBeParsedCheckboxes = message.checkboxData[1];

            // Get all filtered, data complete objects
            elementObjects = parseElements(retrieveElements(), elementsToBeParsedCheckboxes);

            // Sort them
            let elementObjectsSorted = sortElementObjects(elementObjects);

            // Set the descriptive names
            generateAndSetDescriptiveName(elementObjectsSorted);

            // Construct data array to send to backend.
            let outputArray = [];
            outputArray[0] = createOutputFileHeader(); //Create the output file header information.
            outputArray[1] = message.checkboxData[0]; //Pass output file type checkboxes through.
            outputArray[2] = elementsToBeParsedCheckboxes; //Pass element checkboxes data through.
            outputArray[3] = JSON.stringify(elementObjectsSorted); //Call function to serialize all elements into JSON

            // Send the formatted data to the backend
            chrome.runtime.sendMessage({
                outputArray: outputArray
            });
        }
    }
);

//Function that returns a basic json object representing the page data.
function createOutputFileHeader() {
    // Return page URL, current time, and page title in JSON format
    return [{
        'pageURL': window.location.href,
        'timeStamp': new Date().toString(),
        'pageTitle': document.title
    }];
}

//=================================================== Parse and Retrieve Elements ===========================================================

/**
 * Gets every element from the page and wraps it in the Element class.
 *
 * @returns {Array} - Array of Elements, with a unique id attributed to each.
 */
function retrieveElements() {

    // Get every possible object (filtering is done later)
    let elements = document.getElementsByTagName("*");
    console.log("Found " + elements.length + " elements.");

    // Array to hold all the Element objects
    let elementArray = [];

    // Loop through all elements
    for (let i = 0; i < elements.length; i++) {
        // Put in wrapper class and add to array
        elementArray.push(new Element(elements[i]));
    }

    // Return all wrapped Elements in an array
    return elementArray;
}

/**
 * Parses the elements on the webpage, taking in a list of wrapper custom Elements and returning a new list of Elements that has the correct data tags on them
 * (e.g. types, Buttons, links, etc.), and is filtered to include only what is checked to include in the UI.
 *
 * @param elementArray - the array of custom Elements, includes every element on the page
 * @param UIselection - the checkboxes selected in the GUI
 * @returns {*} - a new array of filtered Elements with data on them
 */
function parseElements(elementArray, UIselection) {

    let basicElementArray = getBasicElements(elementArray); //button, links, input, xpath, etc; intuitive UI things that will ALWAYS be used
    let basicAndJSElements = addJSElements(basicElementArray, UIselection); //add JS element data, e.g. on-click
    let basicJSAndAngularElements = getAngularElements(basicAndJSElements, UIselection); //add the angular element data, e.g. ng-click
    // Here is where you could add things such as jQuery() or other future expansion categorical data
    return filterElements(basicJSAndAngularElements, UIselection); //return the filtered list (culls out elements not included in the UI)
}


//=================================================== Filter Elements ===========================================================

/**
 * Gets basic information from each element.
 * Specifically: outerHTML, class, tagName, name, and id.
 *
 * @param elementArray - the array of Elements to parse
 * @returns {*} - the element array passed in
 */
function getBasicElements(elementArray) {
    //For each element set basic data
    elementArray.forEach(function(element) {
        element.setData(element.doc_element.outerHTML,
            element.doc_element.getAttribute("class"),
            element.doc_element.tagName == "" ? null : element.doc_element.tagName,
            element.doc_element.getAttribute("name"),
            element.doc_element.getAttribute("id"),
            getElementXPath(element.doc_element));
    });
    return elementArray;
}

/**
 * Adds JS specific data to the element if it has special JS functionality (e.g. on-click)
 * Only does so if the JS checkbox is selected.
 * Will override isParsed for that element, making it notated as parsed.
 * Returns an updated element array.
 *
 * @param elementObjects - the input element array
 * @param UIselection - the checkboxes selected (ids specifically)
 */
function addJSElements(elementObjects, UIselection) {

    // Array to hold the returned elements
    let returnElements = [];

    // Loop through each element
    for (let i = 0; i < elementObjects.length; i++) {
        if (!elementObjects[i].isParsedAlready() && (UIselection.indexOf("onclick") > -1)) { //If on-click selected in UI and element isn't parsed already
            if (elementObjects[i].fullhtml.indexOf("on-click") != -1) { //If element has on-click ToDo: refine?
                elementObjects[i].setParsed(); //Set parsed
                elementObjects[i].elemEnumType = ElementTypeEnum.ONCLICK; //Set elemEnumType
            }
        }
        returnElements.push(elementObjects[i]); //Regardless of if new data is set or not, add it to the return array
    }

    // Return array with all elements, with JS ones having more data
    return returnElements;
}

/**
 * Adds AngularJS specific data to the element if it has special Angular functionality (e.g. ng-click)
 * Only does so if the Angular checkbox is selected.
 * Will override isParsed for that element, making it notated as parsed.
 * Returns an updated element array.
 *
 * @param elementObjects - the input element array
 * @param UIselection - the checkboxes selected
 */
function getAngularElements(elementObjects, UIselection) {

    // Array to hold the returned elements
    let returnElements = [];

    // Loop through each element
    for (let i = 0; i < elementObjects.length; i++) {
        if (!elementObjects[i].isParsedAlready() && (UIselection.indexOf("ngclick") > -1)) { //If ng-click selected in UI and element isn't parsed already
            if (elementObjects[i].fullhtml.indexOf("ng-click") != -1) { //If element has ng-click ToDo: refine?
                elementObjects[i].setParsed(); //Set parsed
                elementObjects[i].elemEnumType = ElementTypeEnum.NGCLICK; //Set elemEnumType
            }
        }
        returnElements.push(elementObjects[i]); //Regardless of if new data is set or not, add it to the return array
    }

    // Return array with all elements, with JS ones having more data
    return returnElements;
}

/**
 * Function to take in all elements, the filterable checkboxes clicked, and returns the array of Element objects that are of the correct types.
 *
 * @param elementObjects - all HTML elements on the page, already wrapped in the Element class
 * @param filters - the checkboxes, specifically the ids of them
 * @returns {Array} - Element objects, with .parsed=True and .enumType={some ElementTypeEnum} assigned
 */
function filterElements(elementObjects, filters) {

    // Return array to hold filtered elements
    let returnElements = [];

    // For each element
    for (let i = 0; i < elementObjects.length; i++) {
        // If it is not parsed, check if it is a valid element, determined by the UI selection (which assigns data to it if so)
        if (!elementObjects[i].isParsedAlready() && isInSelection(elementObjects[i], filters)) { //For basic elements
            elementObjects[i].setParsed();
            returnElements.push(elementObjects[i]);
        // Otherwise, if it is parsed and has an elemEnumType assigned, simply add it to the return array
        } else if (elementObjects[i].isParsedAlready() && elementObjects[i].elemEnumType != null) { //For angular and js elements
            returnElements.push(elementObjects[i]);
        }
    }

    // Return the new array of carefully selected elements
    return returnElements;
}

/**
 * A helper method for {@link filterElements} that performs the logic of determining if an element should be included in the output.
 * It also assigns the .enumType field in Element for later sorting.
 *
 * @param element - The Element to examine
 * @param filters - The checkboxes, specifically the ids of them
 * @returns {boolean} - True if the element should be included, false otherwise
 */
function isInSelection(element, filters) {

    // For each elements
    for (let i = 0; i < filters.length; i++) {

        // The filter selected in the UI to check against
        let currFilter = filters[i];

        // Simple case, check the tagName (e.g. <button ...></button> against the UI one selected
        if (element.doc_element.tagName == currFilter.toUpperCase()) {
            let enumType;
            switch (element.doc_element.tagName) {
                case "BUTTON":
                    enumType = ElementTypeEnum.BUTTON;
                    break;
                case "LINK":
                    enumType = ElementTypeEnum.LINK;
                    break;
                case "INPUT":
                    enumType = ElementTypeEnum.INPUT;
                    break;
                default: //Error if not one of the elements desired (should theoretically be unreachable due to above equality check for UI currFilter)
                    throw "Invalid element tag: "+element.doc_element.tagName+" is not a BUTTON, LINK, or INPUT and yet is checked in the UI. Needs to be added programmatically here."
            }

            // Assign it if it exists
            element.elemEnumType = enumType;
            // Return success
            return true;
        }
    }

    //Return failure
    return false;
}


//=================================================== Descriptive Names ===========================================================

//ToDo: Everything below here

/**
 * Generate and set a descriptive name "E.g. Home Button" for each element
 * @param elementObjects
 */
function generateAndSetDescriptiveName(elementObjects) {
    elementObjects.forEach(function(element) {
        let name = generateDescriptiveName(element);

        name = checkForUniqueName(elementObjects, name);

        // //ToDo - @Peter (Not sure exactly how you want to address this; here's one option)
        // if (isActuallyDescriptive(name)) {
        //     element.descriptiveName = true;
        // }

        element.descriptiveName = name;
    });
}


/**
 * Generate a (preferably) unique name
 *
 * @param element - the element to analyze
 * @returns {*} - the string representing the name to display
 */
function generateDescriptiveName(element) {
    if (element.name != null) {
        element.hasDescriptiveName = true;
        return capitalizeFirstLetter(camelize(sanitizeDescriptiveName(element.name) + ' ' + element.doc_element.tagName.toLowerCase())); //Name + Type

    } else if (element.id != null) {
        element.hasDescriptiveName = true;
        return capitalizeFirstLetter(camelize(sanitizeDescriptiveName(element.id) + ' ' + element.doc_element.tagName.toLowerCase())); //ID + Type

    } else {
        if (element.doc_element.textContent != '') {
            let sanitizedName = sanitizeDescriptiveName(element.doc_element.textContent);
            if (sanitizedName.trim() == '') {
                //Make sure the sanitized name is not an empty string
                return capitalizeFirstLetter(getElemTypeAsDescriptiveName(element));
            }

            element.hasDescriptiveName = true;
            sanitizedName = sanitizedName + ' ' + element.doc_element.tagName.toLowerCase();
            return capitalizeFirstLetter(camelize(sanitizedName));
        }
        return capitalizeFirstLetter(getElemTypeAsDescriptiveName(element));
    }
}

/**
 * Get and return the element's tag name in case that there is no other descriptive name.
 *
 * @param element - the element to use
 * @returns {string} - the element's tag name
 */
function getElemTypeAsDescriptiveName(element) {
    //TODO: Set flag to include full HTML in output file.
    return element.doc_element.tagName.toLowerCase();
}

/**
 * TODO: Function to remove anything but letters and numbers from a descriptive name.
 * Whitespace on the front and back of the string is trimmed.
 *
 * @param name - String of the unsanitized descriptive name
 * @returns {string} - Sanitized descriptive name
 */
function sanitizeDescriptiveName(name) {
    let sanitizedName = name.replace(/[^a-z\d\s]+/gi, "");
    sanitizedName = sanitizedName.replace(/\s\s+/g, ' ');
    return sanitizedName.trim();
}

/**
 * Function to return a string with the first character capitalized.
 *
 * @param name - String of descriptive name
 * @returns {string} - String of descriptive name with the first character capitalized
 */
function capitalizeFirstLetter(name) {
    //Make sure the first character is a letter and not a number.
    if (name.charAt(0).match(/[a-z]/i)) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return name;
}

/**
 * Function to camelize a string of words separated by spaces.
 *
 * @param name - String to be camelized
 * @returns {string} - Camelized string
 */
function camelize(name) {
    return name.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return "";
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

/**
 * TODO: Function to check and make any descriptive name unique.
 *
 * @param elementObjects - The array of elements
 * @param name - The generated descriptive name
 * @returns name - The unique descriptive name
 */
function checkForUniqueName(elementObjects, name) {
    //console.log("Checking for unique.");
    let frequencyArray = [];
    for (let i = 0; i < elementObjects.length; i++) {
        //console.log(elementObjects[i].descriptiveName);
        if (elementObjects[i].descriptiveName != null && elementObjects[i].descriptiveName.startsWith(name)) {
            frequencyArray.push(elementObjects[i].doc_element.descriptiveName);
        }
    }
    if (frequencyArray.length == 0){
      return name;
    } else {
      return name + frequencyArray.length;
    }
}


//=================================================== Sort + XPath ===========================================================


// Sorts Element array based on the ordering of elements in the elementsToBeParsedCheckboxes
function sortElementObjects(elementArray) {
    elementArray.sort((a, b) => a.elemEnumType.localeCompare(b.elemEnumType)); //just compare the elemEnumType by alphabetical order
    return elementArray;
}


/**
 * Gets an XPath for an element which describes its hierarchical location.
 * Taken from: https://stackoverflow.com/questions/3454526/how-to-calculate-the-xpath-position-of-an-element-using-javascript
 * Adapted from open source firebug xpath code.
 */
function getElementXPath(element) {
    if (element && element.id)
        return '//*[@id="' + element.id + '"]';
    else
        return getElementTreeXPath(element);
}

function getElementTreeXPath(element) {
    let paths = [];

    for (; element && element.nodeType == 1; element = element.parentNode) {
        let index = 0;

        if (element && element.id) {
            paths.splice(0, 0, '/*[@id="' + element.id + '"]');
            break;
        }

        for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.nodeName == element.nodeName)
                ++index;
        }

        let tagName = element.nodeName.toLowerCase();
        let pathIndex = (index ? "[" + (index + 1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : null;
};
