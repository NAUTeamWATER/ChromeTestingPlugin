// The extension background enviroment as specified in the manifest.
var outputFileHeader = [];
var outputFileCheckboxes = [];
var elementObjects = [];

chrome.runtime.onMessage.addListener(function(
    message, sender, sendResponse) {

    //Read and assign recieved data from the middleware.
    if (message.outputArray) {
        outputFileHeader = message.outputArray[0];
        outputFileCheckboxes = message.outputArray[1];
        elementObjects = JSON.parse(message.outputArray[2]);
    }

    //Logic for downloading files.
    for (var i = 0; i < outputFileCheckboxes.length; i++) {
        switch (outputFileCheckboxes[i]) {
            case 'fileoutput_xml':
                createXMLFile(outputFileHeader, elementObjects);
                break;
            case 'fileoutput_selenium':
                createSeleniumFile(outputFileHeader, elementObjects);
                break;
            case 'fileoutput_jasmine':
                //!!Temporary placement for testing!!
                createTextFile(outputFileHeader, elementObjects);
                break;
            default:
                console.log('Invalid file output.');
        }
    }
});


// TODO: Function to take the element object array and sort it by element type.
function sortElementObjects(elementObjects) {

}

//function for testing purposes
function createTextFile(outputFileHeader, elementObjects) {
    var fileString = '';
    fileString += 'Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp;
    //For testing purposes:
    //console.log("Length of checkbox array: " + outputFileCheckboxes.length);
    //console.log(outputFileCheckboxes[0]);

    //Add elements to file
    fileString += "\n";
    for (var i = 0; i < elementObjects.length; i++) {
        fileString += JSON.stringify(elementObjects[i]);
        fileString += "\n---\n"; //append to file
    }

    // Snippet I want to keep and research later(Max)
    // var a = DOMParser(); var xml = "<node></node>"; xml = a.parseFromString(xml, "application/xml" ); xml.getElementsByTagName("node") + ""; //"[object HTMLCollection]"

    var blob = new Blob([fileString], {
        type: 'text/plain'
    });
    //console.log("Created Blob object.");

    objectURL = URL.createObjectURL(blob);
    console.log("Made link from Blob object.");

    download(objectURL, "water_results.txt");
}

//TODO: Function to take the sorted element object array, parse through, and create an XML file and download it.
function createXMLFile(outputFileHeader, elementObjects) {
    var fileString = '';
    fileString += '<?xml version="1.0" encoding="UTF-8"?>\n';
    fileString += '<!--Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp + '-->';
    fileString += '<output>\n';
    fileString += '<page_data>\n';
    fileString += '\t<page_url>' + outputFileHeader[0].pageURL + '</page_url>\n';
    fileString += '\t<timestamp>' + outputFileHeader[0].timeStamp + '</timestamp>\n';
    fileString += '\t<page_title>' + outputFileHeader[0].pageTitle + '</page_title>\n';
    fileString += '</page_data>\n';
    fileString += '<elements>\n';
    //Loop through elements here...
    fileString += '</elements>\n';
    fileString += '</output>\n';

    var blob = new Blob([fileString], {
        type: 'text/plain'
    });
    //console.log("Created Blob object.");

    objectURL = URL.createObjectURL(blob);
    //console.log("Made link from Blob object.");
    download(objectURL, 'water_results.xml');
}

//TODO: Function to take sorted element object array, parse through, and create a Selenium compatible .java file and download it.
function createSeleniumFile(outputFileHeader, elementObjects) {
    var fileString = '';
    fileString += '/*Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp + '*/';
    //Loop through elements here...

    var blob = new Blob([fileString], {
        type: 'text/plain'
    });
    //console.log("Created Blob object.");

    objectURL = URL.createObjectURL(blob);
    //console.log("Made link from Blob object.");
    download(objectURL, 'water_results.java');

}

//TODO: Function to take sorted element object array, parse through, and create a Jasmine and/or Protractor compatable .js file and download it.
function createJSObject(outputFileHeader, elementObjects) {

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
