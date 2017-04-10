// import Element from "./classes/Element";
// Script that runs on the current tab enviroment.

//Maybe do something different with these global variables? Class? Will have to work with the messaging function in frontend though...
var elementsToBeParsedCheckboxes = [];
var outputFileCheckboxes = [];
var elementObjects = []; //Will eventually be an array of objects...


//All code that runs in the middleware needs to be in this Listener function.
chrome.runtime.onMessage.addListener(

    function(message, sender, sendResponse) {

        if (message.checkboxData) {
            //Read message and assign passed in data from the frontend.
            elementsToBeParsedCheckboxes = message.checkboxData[1];

            //get all filtered, data complete objects
            elementObjects = parseElements(retrieveElements(), elementsToBeParsedCheckboxes);

            //sort them
            let elementObjectsFiltered = sortElementObjects(elementObjects);

            //set the descriptive name
            generateAndSetDescriptiveName(elementObjectsFiltered);

            //Construct data array to send to backend.
            let outputArray = [];
            outputArray[0] = createOutputFileHeader(); //Create the output file header information.
            outputArray[1] = message.checkboxData[0]; //Pass output file type checkboxes through.
            outputArray[2] = JSON.stringify(elementObjectsFiltered); //Call function to pull all elements. I.E. = getPageElements();

            sendBackgroundData(outputArray);
        }
    });

function sendBackgroundData(outputArray) {
    //Send the output data to the background script enviroment though Chrome API message.

    chrome.runtime.sendMessage({
        outputArray: outputArray
    });
}

//Function that returns a json object representing the page data.
function createOutputFileHeader() {
    var timeStamp = new Date().toString();

    var outputFileHeader = [{
        'pageURL': window.location.href,
        'timeStamp': timeStamp,
        'pageTitle': document.title
    }];

    return outputFileHeader;
}

ElementTypeEnum = Object.freeze({
    BUTTON: "Button",
    LINK: "Link",
    INPUT: "Input"
});


//ToDo: Fix import issue
/**
 * Wrapper class for DOM elements that contains a UUID (unique ID), as well as fields and helper methods.
 */
class Element {

    //no constructor overloading, hence the setData() method
    constructor(doc_element, uniqueID) {
        this.doc_element = doc_element; //HTMLCollection
        this.uniqueID = uniqueID;
        this.parsed = false;
        this.elemEnumType = null;

        //ToDo: keep basic values here as fields or delegate to helper methods?
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

    setData(fullhtml, clazz, tag, name, id, xPath) {
        this.fullhtml = fullhtml;
        this.clazz = clazz;
        this.tag = tag;
        this.name = name;
        this.id = id;
        this.xpath = xPath;
    }

    setElemEnumType(enumType) {
        this.elemEnumType = enumType;
    }

    setDescriptiveName(name) {
        this.descriptiveName = name;
    }

    setHasDescriptiveName(bool) {
      this.hasDescriptiveName = bool;
    }

    toJSON() {
        return {
            'hasDescriptiveName': this.hasDescriptiveName,
            'descriptiveName': this.descriptiveName,
            'fullHTML': this.fullhtml,
            'type': this.elemEnumType,
            'class': this.clazz,
            // 'Tag': this.tag,
            'id': this.id,
            'name': this.name,
            'xpath': this.xpath
        };
    }

    /**
     * To allow checking of parsing status to know if it has been analyzed already
     */
    setParsed() {
        if (!this.parsed) this.parsed = true;
    }

    /**
     * To allow checking of parsing status to know if it has been analyzed already
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
        //ToDo
    }

    static greaterThan() {
        //ToDo: method to organize array of these objects in order
    }

    //ToDo: Helper methods for each subsection (basic/jquery/etc)

}

/**
 * Simple function to take in all elements, the filterable checkboxes clicked, and returns the array of Element objects that are of the correct types.
 *
 * @param elementObjects - all HTML elements on the page, already wrapped in the Element class
 * @param filters - the checkboxes, specifically the ids of them
 * @returns {Array} - Element objects, with .parsed=True and .enumType={some ElementTypeEnum} assigned
 */
function filterElements(elementObjects, filters) {
    let returnElements = [];
    for (let i = 0; i < elementObjects.length; i++) {
        if (!elementObjects[i].isParsedAlready() && isInSelection(elementObjects[i], filters)) {
            elementObjects[i].setParsed();
            returnElements.push(elementObjects[i]);
        }
    }
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
    for (let i = 0; i < filters.length; i++) {
        let currFilter = filters[i];
        //simple case, check the tagName (e.g. <button ...></button>
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
            }
            element.setElemEnumType(enumType);
            return true;
        }
    }
    return false;
}

/**
 * Gets every element from the page and wraps it in the Element class.
 *
 * @returns {Array} - Array of Elements, with a unique id attributed to each.
 */
function retrieveElements() {

    var elements = document.getElementsByTagName("*");
    console.log("Found " + elements.length + " elements.");

    var elementArray = [];

    //random IDs //ToDo: Remove?
    let uuid = function() {
        let fourChars = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
        };
        return (fourChars() + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + fourChars() + fourChars());
    };

    //loop through all elements
    for (let i = 0; i < elements.length; i++) {
        //put in wrapper class and add to array
        elementArray.push(new Element(elements[i], uuid()));
    }

    return elementArray;
}

/**
 * Parses the elements on the webpage, taking in a list of wrapper custom "Element"s and returning a new list of "Element"s that has the correct data tags on them
 * (e.g. types, Buttons, links, etc.), and is filtered to include only what is checked to include in the UI,
 *
 * @param elementArray - the array of custom Elements, includes every element on the page
 * @param UIselection - the checkboxes selected in the GUI
 * @returns {*} - a new array of filtered Elements with data on them
 */
function parseElements(elementArray, UIselection) {

    let basicElementArray = getBasicElements(elementArray); //button, links, input, xpath, etc //intuitive UI things that will ALWAYS be used
    let basicAndJSElements = addJSElements(basicElementArray, UIselection); //add JS element data, e.g. on-click
    let basicJSAndAngularElements = getAngularElements(basicAndJSElements, UIselection); //add the angular element data, e.g. ng-click
    return filterElements(basicJSAndAngularElements, UIselection); //return the filtered list (culls out elements not included in the UI)
    // jquery(); //or others
}

/**
 * Gets basic information from each element.
 * Specifically: outerHTML, class, tagName, name, and id.
 *
 * @param elementArray - the array of Elements to parse
 * @returns {*} - the element array passed in
 */
function getBasicElements(elementArray) {
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

        element.setDescriptiveName(name);
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
        element.setHasDescriptiveName(true);
        return capitalizeFirstLetter(camelize(sanitizeDescriptiveName(element.name) + ' ' + element.doc_element.tagName.toLowerCase())); //Name + Type

    } else if (element.id != null) {
        element.setHasDescriptiveName(true);
        return capitalizeFirstLetter(camelize(sanitizeDescriptiveName(element.id) + ' ' + element.doc_element.tagName.toLowerCase())); //ID + Type

    } else {
        if (element.doc_element.textContent != '') {
            var sanitizedName = sanitizeDescriptiveName(element.doc_element.textContent);
            if (sanitizedName.trim() == '') {
                //Make sure the sanitized name is not an empty string
                return capitalizeFirstLetter(getElemTypeAsDescriptiveName(element));
            }
            
            element.setHasDescriptiveName(true);
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
    var sanitizedName = name.replace(/[^a-z\d\s]+/gi, "");
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


/**
 * Adds JS specific data to the element if it has special JS functionality (e.g. on-click)
 * Only does so if the JS checkbox is selected.
 * Will override isParsed for that element, making it notated as parsed.
 * Returns an updated element array.
 *
 * @param basicElementArray - the input element array
 * @param UIselection - the checkboxes selected
 */
function addJSElements(basicElementArray, UIselection) {
    //ToDo
    return basicElementArray; //placeholder for testing, remove once it is actually working
}

/**
 * Adds AngularJS specific data to the element if it has special Angular functionality (e.g. ng-click)
 * Only does so if the Angular checkbox is selected.
 * Will override isParsed for that element, making it notated as parsed.
 * Returns an updated element array.
 *
 * @param basicElementArray - the input element array
 * @param UIselection - the checkboxes selected
 */
function getAngularElements(basicElementArray, UIselection) {
    //ToDo
    return basicElementArray; //placeholder for testing, remove once it is actually working
}


// Sorts Element array based on the ordering of elements in the elementsToBeParsedCheckboxes
function sortElementObjects(elementArray) {
    var sortedarray = [];
    var length = 0;
    for (var i = 0; i < elementsToBeParsedCheckboxes.length; i++) {
        var word = String(elementsToBeParsedCheckboxes[i]);
        for (var j = 0; j < elementArray.length; j++) {
            var type = String(elementArray[j].elemEnumType);
            type = type.toLowerCase();
            if (type == word) {
                sortedarray[length] = elementArray[j];
                length += 1;
            }
        }
    }
    return sortedarray;
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
};

function getElementTreeXPath(element) {
    var paths = [];

    for (; element && element.nodeType == 1; element = element.parentNode) {
        var index = 0;

        if (element && element.id) {
            paths.splice(0, 0, '/*[@id="' + element.id + '"]');
            break;
        }

        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.nodeName == element.nodeName)
                ++index;
        }

        var tagName = element.nodeName.toLowerCase();
        var pathIndex = (index ? "[" + (index + 1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : null;
};
