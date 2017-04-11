// The extension background enviroment as specified in the manifest.
var outputFileHeader = [];
var outputFileCheckboxes = [];
var elementsToBeParsedCheckboxes = [];
var elementObjects = [];

chrome.runtime.onMessage.addListener(function(
    message, sender, sendResponse) {

    //Read and assign recieved data from the middleware.
    if (message.outputArray) {
        outputFileHeader = message.outputArray[0];
        outputFileCheckboxes = message.outputArray[1];
        elementsToBeParsedCheckboxes = message.outputArray[2];
        elementObjects = JSON.parse(message.outputArray[3]);
    }

    //Logic for downloading files.
    for (var i = 0; i < outputFileCheckboxes.length; i++) {
        switch (outputFileCheckboxes[i]) {
            case 'fileoutput_text':
                createTextFile(outputFileHeader, elementObjects);
                break;
            case 'fileoutput_xml':
                createXMLFile(outputFileHeader, elementObjects);
                break;
            case 'fileoutput_selenium':
                createSeleniumFile(outputFileHeader, elementObjects);
                break;
            case 'fileoutput_jasmine':
                createJSObject(outputFileHeader, elementObjects);
                break;

            default:
                console.log('Invalid file output.');
        }
    }
});

//function for testing purposes
function createTextFile(outputFileHeader, elementObjects) {
    var fileString = '';
    fileString += 'Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp;
    fileString += '\n Retrieved '+ elementObjects.length + ' total elements from ' + elementsToBeParsedCheckboxes.length +' categories.';
    //For testing purposes:
    //console.log("Length of checkbox array: " + outputFileCheckboxes.length);
    //console.log(outputFileCheckboxes[0]);

    //Add elements to file
    fileString += "\n";

    function addElementsToString(fileString, elementObject) {
        fileString += JSON.stringify(elementObject, undefined, 2);
        fileString += "\n---\n"; //append to file
        return fileString;
    }

    for (var i = 0; i < elementObjects.length; i++) {
        fileString = addElementsToString(fileString, elementObjects[i]);
    }

    // Snippet I want to keep and research later(Max)
    // var a = DOMParser(); var xml = "<node></node>"; xml = a.parseFromString(xml, "application/xml" ); xml.getElementsByTagName("node") + ""; //"[object HTMLCollection]"

    var blob = new Blob([fileString], {
        type: 'text/plain'
    });
    //console.log("Created Blob object.");

    objectURL = URL.createObjectURL(blob);
    console.log("Made link from Blob object.");

    download(objectURL, generateFileName(outputFileHeader[0].pageTitle, outputFileHeader[0].timeStamp));
}

//Function to take the sorted element object array, parse through, and create an XML file and download it.
function createXMLFile(outputFileHeader, elementObjects) {
    var fileString = '';
    fileString += '<?xml version="1.0" encoding="UTF-8"?>\n';
    fileString += '<!--Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp + '.-->';
    fileString += '<!-- Retrieved ' + elementObjects.length + ' elements from ' + elementsToBeParsedCheckboxes.length +' categories.-->'
    fileString += '<output>\n';
    fileString += '<page_data>\n';
    fileString += '\t<page_url>' + outputFileHeader[0].pageURL + '</page_url>\n';
    fileString += '\t<timestamp>' + outputFileHeader[0].timeStamp + '</timestamp>\n';
    fileString += '\t<page_title>' + sanitizeString(outputFileHeader[0].pageTitle) + '</page_title>\n';
    fileString += '</page_data>\n';
    fileString += '<elements>\n';
    //Loop through elements here...
    for (var i = 0; i < elementObjects.length; i++){
      fileString += '\t<element>\n';
      fileString += '\t\t<element_type>' + elementObjects[i].type + '</element_type>\n';
      fileString += '\t\t<element_id>' + elementObjects[i].id + '</element_id>\n';
      fileString += '\t\t<element_name>' + elementObjects[i].name + '</element_name>\n';
      fileString += '\t\t<element_xpath>' + elementObjects[i].xpath + '</element_xpath>\n';
      fileString += '\t</element>\n';
    }
    fileString += '</elements>\n';
    fileString += '</output>\n';

    var blob = new Blob([fileString], {
        type: 'text/plain'
    });
    //console.log("Created Blob object.");

    objectURL = URL.createObjectURL(blob);
    //console.log("Made link from Blob object.");
    download(objectURL, generateFileName(outputFileHeader[0].pageTitle, outputFileHeader[0].timeStamp));
}

//TODO: Function to take sorted element object array, parse through, and create a Selenium compatible .java file and download it.
function createSeleniumFile(outputFileHeader, elementObjects) {
    var fileString = '';
    fileString += '/*Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp + '*/';

	//finds non null element data and makes a WebElement out of it
	function FindNonNullValue(fileString, elementObject) {
		if (elementObject.name != null){
			fileString += '      WebElement webElement = webDriver.findElement(By.name("' + elementObject.name  + '"));\n' ;
		}
		else if(elementObject.id != null){
			fileString += '      WebElement webElement = webDriver.findElement(By.id("' + elementObject.id  + '"));\n' ;
		}
		else if(elementObject.class != null){
			fileString += '      WebElement webElement = webDriver.findElement(By.class("' + elementObject.class  + '"));\n' ;
		}
		else {
			fileString += '      WebElement webElement = webDriver.findElement(By.xpath("' + elementObject.xpath  + '"));\n' ;
		}
		return fileString;
    }
	//adds testing functionality to webElement; Need to see if actually works with Selenium
	function SetupTesting(fileString, elementObject) {
		if (elementObject.type == 'Button'){
			fileString += '      webElement.click();\n' ;
		}
		else if(elementObject.type == 'Link'){
			fileString += '      webElement.click();\n' ;
		}
		else if(elementObject.type == 'Input'){
			fileString += '      webElement.getAttribute("value");\n' ;
		}
		else {
			return fileString;
		}
		return fileString;
    }
    //Loop through elements here...
	fileString += '\n';
	fileString += 'import org.openqa.selenium.*;';
	fileString += '\n\n';
	fileString += 'public class SampleTestClass { \n\n';
	fileString += '   public WebDriver webDriver;\n\n'
    for (var i = 0; i < elementObjects.length; i++){
		fileString += '/*' +elementObjects[i].fullHTML + '*/\n';
		if (elementObjects[i].id != null){
			fileString += '   public void '+elementObjects[i].type + elementObjects[i].id + '(){\n' ;
		}
		else{
			fileString += '   public void '+elementObjects[i].type + elementObjects[i].class + '(){\n' ;
		}
		fileString += '\n';
		fileString = FindNonNullValue(fileString, elementObjects[i]);
		fileString = SetupTesting(fileString, elementObjects[i]);
		fileString += '   }';
		fileString += '\n\n';
		if (elementObjects[i].type == 'Input'){
			if (elementObjects[i].id != null){
				fileString += '   public void set'+elementObjects[i].type + elementObjects[i].id + '(String value){\n' ;
			}
			else{
				fileString += '   public void set'+elementObjects[i].type + elementObjects[i].class + '(String value){\n' ;
			}
			fileString += '\n';
			fileString = FindNonNullValue(fileString, elementObjects[i]);
			fileString += '      webElement.sendKeys(value);\n' ;
			fileString += '   }';
			fileString += '\n\n';
		}
    }
	fileString += '}';

    var blob = new Blob([fileString], {
        type: 'text/plain'
    });
    //console.log("Created Blob object.");

    objectURL = URL.createObjectURL(blob);
    //console.log("Made link from Blob object.");
    download(objectURL, generateFileName(outputFileHeader[0].pageTitle, outputFileHeader[0].timeStamp));

}

//TODO: Function to take sorted element object array, parse through, and create a Jasmine and/or Protractor compatable .js file and download it.
function createJSObject(outputFileHeader, elementObjects) {
    var fileString = '';
    fileString += '/*Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp + '*/';

    var blob = new Blob([fileString], {
        type: 'text/plain'
    });
    //console.log("Created Blob object.");

    objectURL = URL.createObjectURL(blob);
    //console.log("Made link from Blob object.");
    download(objectURL, generateFileName(outputFileHeader[0].pageTitle, outputFileHeader[0].timeStamp));
}

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
 * A helper function to generate a custom file name for a file to be downloaded.
 *
 * @param pageTitle - The string of the page title where the elements were pulled from.
 * @param timeStamp - The string of the timeStamp
 * @returns {string} - The name that the file should be.
 */
function generateFileName(pageTitle, timeStamp){
  var fileName = sanitizeString(pageTitle).split(' ').join('_');

  if (fileName === ""){
    fileName = 'UntitledPage';
  }
  //Convert timestamp from: Mon Mar 27 2017 23:58:30 GMT-0700 (MST)
  var timeString = timeStamp.split(' ', 5);
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
  var sanitizedString = string.replace(/[^a-z\d\s]+/gi, "");
  sanitizedString = sanitizedString.replace(/\s\s+/g, ' ');

  return sanitizedString;
}
