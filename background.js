// The extension background enviroment as specified in the manifest.
var outputFileHeader;
var outputFileCheckboxes = [];
var elementObjects = [];

chrome.runtime.onMessage.addListener(function(
    message, sender, sendResponse) {

    //Read and assign recieved data from the middleware.
    if (message.outputArray) {
        outputFileHeader = message.outputArray[0];
        outputFileCheckboxes = message.outputArray[1];
        elementObjects = message.outputArray[2];
    }

    //For testing purposes:
    //console.log("Length of checkbox array: " + outputFileCheckboxes.length);
    //console.log(outputFileCheckboxes[0]);
    console.log(outputFileCheckboxes.length);
    var blob = new Blob([outputFileHeader], {
        type: 'text/plain'
    });
    console.log("Created Blob object.");

    objectURL = URL.createObjectURL(blob);
    console.log("Made link from Blob object.");

    download(objectURL, "water_plugin_test.txt");

});

// TODO: Function to take the element object array and sort it by element type.
function sortElementObjects(elementObjects) {

}

//TODO: Function to take the sorted element object array, parse through, and create an XML file and download it.
function createXMLFile(elementObjects) {

}

//TODO: Function to take sorted element object array, parse through, and create a Selenium compatible .java file and download it.
function createSeleniumFile(elementObjects) {

}

//TODO: Function to take sorted element object array, parse through, and create a Jasmine and/or Protractor compatable .js file and download it.
function createJSObject(elementObjects) {

}

/**
 * Function that takes an objectURL and a string fileName and makes use of the ChromeAPI download to
 * download the object as a file.
 */
function download(objectURL, fileName) {
    chrome.downloads.download({
            url: objectURL,
            filename: fileName
        },
        function(id) {});
}
