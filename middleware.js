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

            // elementObjects = retrieveElements();
            // elementObjects = parseElements(); //This is bugged

            //Construct data array to send to backend.
            var outputArray = [];
            outputArray[0] = createOutputFileHeader(); //Create the output file header information.
            outputArray[1] = message.checkboxData[0]; //Pass output file type checkboxes through.
            outputArray[2] = retrieveElements(); //Call function to pull all elements. I.E. = getPageElements();

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
        // var test = document.createElement(elements[i].tagName);
        // var e = Element.constructor(elements[i], uuid()); //was buggy, may or may not be fixed now

        var htmlCollection = elements[i];
        elementArray.push(htmlCollection); //works w/ html collection, but is lost in sending the message
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
