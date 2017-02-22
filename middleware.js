// import Element from "./classes/Element";
// Script that runs on the current tab enviroment.

//Maybe do something different with these global variables? Class? Will have to work with the messaging function in frontend though...
var elementsToBeParsedCheckboxes = [];
var outputFileCheckboxes = [];
var elementObjects = []; //Will eventually be an array of objects...


//All code that runs in the middleware needs to be in this Listener function.
chrome.runtime.onMessage.addListener(

    function(message, sender, sendResponse) {
        console.log("here");

        if (message.checkboxData) {
            //Read message and assign passed in data from the frontend.
            elementsToBeParsedCheckboxes = message.checkboxData[1];

            elementObjects = parseElements(retrieveElements());

            //Construct data array to send to backend.
            var outputArray = [];
            outputArray[0] = createOutputFileHeader(); //Create the output file header information.
            outputArray[1] = message.checkboxData[0]; //Pass output file type checkboxes through.
            outputArray[2] = JSON.stringify(elementObjects); //Call function to pull all elements. I.E. = getPageElements();

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

        //ToDo: keep basic values here as fields or delegate to helper methods?
        this.name = null;
        this.id = null;
        this.xpath = null;
        this.description = null;
    }

    setData(name, id, xPath) {
        this.name = name;
        this.id = id;
        this.xpath = xPath;
    }

    toJSON(){
        return {
            'Name': this.name,
            'ID': this.id,
            'XPath': this.xpath
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
    toString(){
        return "Element "+"\nID: "+this.id+"\nName: "+this.name;
        //ToDo
    }

    static greaterThan(){
        //ToDo: method to organize array of these objects in order
    }

    //ToDo: Helper methods for each subsection (basic/jquery/etc)

}



/**
 * Function which when called takes no parameters and retrieves all UI elements given a document DOM.
 * !! Will take an array as input and populates the given array with element objects. !!
 */
function retrieveElements() {

    //ToDo: if statements for toggling which elements to access
    var elements = document.getElementsByTagName("*");
    console.log("Found " + elements.length + " elements.");

    var elementArray = [];

    //random IDs
    var uuid = function() {
        var fourChars = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
        };
        return (fourChars() + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + fourChars() + fourChars());
    };

    //loop through all elements
    for (var i = 0; i < elements.length; i++) {

        //add a new Element type to the array
        var e = new Element(elements[i], uuid());
        elementArray.push(e);
    }

    return elementArray;

}

function parseElements(elementArray) {

    //if (!elementArray[i].isParsedAlready())

    return getBasicElements(elementArray); //button, links, input, etc //intuitive UI things
    // xPath(); //xpaths for all items (keep here, or elsewhere, internally?)
    // angularStuff(); //ngClick
    // jquery(); //?
    // javascript(); //onClick //odd uses, e.g. apply method post click to change page

    //something to pass to sendMessage()
}

//Wip, not really functional yet
function getBasicElements(elementArray) {
    elementArray.forEach(function(element) {
        element.setData(element.doc_element.toString(), element.uniqueID, "xPath ToDo");
    });
    return elementArray;
}
