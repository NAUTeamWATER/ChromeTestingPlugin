/**
 * Background takes in the information from the middleware (the parsed elements, plus info
 * from the frontend UI), and creates the file outputs it should, formatting them as required.
 */


//Imports
import { createTextFile } from 'outputFileTypes/text';
import { createXMLFile } from 'outputFileTypes/xml';
import { createSeleniumFile } from 'outputFileTypes/selenium';
import { createJSObjectsFile } from 'outputFileTypes/jsObjects';

// Variables used to hold the most important pieces of data
let outputFileHeader = []; //Info from the page parsed for the header of the output file
let outputFileCheckboxes = []; //The file types selected in the UI
let elementsToBeParsedCheckboxes = []; //The elements selected in the UI
let elementObjects = []; //The parsed Elements themselves

// The main code loop
chrome.runtime.onMessage.addListener(function(
    message, sender, sendResponse) {

    //Read and assign received data from the middleware.
    if (message.outputArray) {
        outputFileHeader = message.outputArray[0];
        outputFileCheckboxes = message.outputArray[1];
        elementsToBeParsedCheckboxes = message.outputArray[2];
        elementObjects = JSON.parse(message.outputArray[3]);
    }

    // Create the various types of complete files as needed, and download them with generated filenames
    for (let i = 0; i < outputFileCheckboxes.length; i++) {

        switch (outputFileCheckboxes[i]) {

            case 'fileoutput_text': //Text file
                download(
                    URL.createObjectURL( //Create downloadable
                        createTextFile(outputFileHeader, elementObjects, getDefaultHeaderString()) //Create the file
                    ),
                    generateFileNameDefault()+".txt"); //Generate filename
                break;
            case 'fileoutput_xml': //XML file
                download(
                    URL.createObjectURL( //Create downloadable
                        createXMLFile(outputFileHeader, elementObjects, getDefaultHeaderString()) //Create the file
                    ),
                    generateFileNameDefault()+".xml"); //Generate filename
                break;
            case 'fileoutput_selenium': //Selenium (Java) file
                download(
                    URL.createObjectURL( //Create downloadable
                        createSeleniumFile(outputFileHeader, elementObjects, getDefaultHeaderString()) //Create the file
                    ),
                    generateFileNameDefault()+".java"); //Generate filename
                break;
            case 'fileoutput_jasmine': //Jasmine (JS) file //ToDo: Change to JSObjects
                download(
                    URL.createObjectURL( //Create downloadable
                        createJSObjectsFile(outputFileHeader, elementObjects, getDefaultHeaderString()) //Create the file
                    ),
                    generateFileNameDefault()+".js"); //Generate filename
                break;

            default:
                console.log('Invalid file output.'); //Should theoretically be unreachable

        }
    }
});


//=================================================== Helper Functions ===========================================================

/**
 * Function that takes an objectURL and a string fileName and makes use of the ChromeAPI download to download the object as a file.
 *
 * @param objectURL - The Blob type URL to be downloaded.
 * @param fileName - The name of the output file to be downloaded.
 */
function download(objectURL, fileName) {
    chrome.downloads.download({
            url: objectURL,
            filename: fileName
        },
        function(id) {});
}

/**
 * Function which calls the more abstract generateFileName(pageTitle, timeStamp) with the values used nearly every time
 *
 * @returns {string} - filename
 */
function generateFileNameDefault(){
    return generateFileName(outputFileHeader[0].pageTitle, outputFileHeader[0].timeStamp)
}

/**
 * A helper function to generate a custom file name for a file to be downloaded.
 *
 * @param pageTitle - The string of the page title where the elements were pulled from.
 * @param timeStamp - The string of the timeStamp
 * @returns {string} - The name that the file should be.
 */
function generateFileName(pageTitle, timeStamp){
  let fileName = sanitizeString(pageTitle).split(' ').join('_');

  if (fileName === ""){
    fileName = 'UntitledPage';
  }
  //Convert timestamp from: Mon Mar 27 2017 23:58:30 GMT-0700 (MST)
  const timeString = timeStamp.split(' ', 5);
  fileName += '_'+timeString[1]+'_';
  fileName += timeString[2]+'_';
  fileName += timeString[3]+'_';
  fileName += timeString[4].split(':').join('_');

  return fileName;
}

/**
 * A helper function to remove any character in a string other than letters and numbers using a regexpr.
 * Multiple spaces/tabs/newlines are also replaced with single spaces.
 *
 * @param string - The input string to be sanitized.
 * @returns {string} - The sanitized string.
 */
function sanitizeString(string){
  let sanitizedString = string.replace(/[^a-z\d\s]+/gi, "");
  sanitizedString = sanitizedString.replace(/\s\s+/g, ' ');

  return sanitizedString;
}

/**
 * Get the basic header information for each file
 * @returns {[*,*]} - array of strings
 */
function getDefaultHeaderString(){
    return [
        'Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp,
        '\n Retrieved '+ elementObjects.length + ' total elements from ' + elementsToBeParsedCheckboxes.length +' categories.'
    ]
    //ToDo: x out of y selected categories
}