/**
 * Background takes in the information from the middleware (the parsed elements, plus info
 * from the frontend UI), and creates the file outputs it should, formatting them as required.
 */

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
            case 'fileoutput_text':
                download(createTextFile(outputFileHeader, elementObjects), generateFileNameDefault());
                break;
            case 'fileoutput_xml':
                download(createXMLFile(outputFileHeader, elementObjects), generateFileNameDefault());
                break;
            case 'fileoutput_selenium':
                download(createSeleniumFile(outputFileHeader, elementObjects), generateFileNameDefault());
                break;
            case 'fileoutput_jasmine':
                download(createJSObject(outputFileHeader, elementObjects), generateFileNameDefault());
                break;

            default:
                console.log('Invalid file output.');
        }
    }
});

//=================================================== Text File ===========================================================
//ToDo: Cleanup everything below here

//function for testing purposes
function createTextFile(outputFileHeader, elementObjects) {
    var fileString = '';
    fileString += 'Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp;
    fileString += '\n Retrieved '+ elementObjects.length + ' total elements from ' + elementsToBeParsedCheckboxes.length +' categories.'; //ToDo: x out of y selected categories
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

    return URL.createObjectURL(blob);

}

//=================================================== XML File ===========================================================

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

    return URL.createObjectURL(blob);
}

//=================================================== Selenium (Java) File ===========================================================

//TODO: Function to take sorted element object array, parse through, and create a Selenium compatible .java file and download it.
function createSeleniumFile(outputFileHeader, elementObjects) {
    var fileString = '';
    fileString += '/*Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp + '*/';

////// commented out code is for Users that aren't Choice Hotel employees 
	
	//adds testing functionality to webElement; Need to see if actually works with Selenium
	function SetupTesting(fileString, elementObject) {
		if (elementObject.type == 'Button'){
			fileString += '   public void click'+elementObject.descriptiveName + '(){\n' ;		
			if (elementObject.name != null){
				//fileString += '      WebElement webElement = webDriver.findElement(By.name("'+ elementObject.name  + '");\n';
				fileString += '      page.clickElementByName("' + elementObject.name  + '");\n' ;
			}
			else if(elementObject.id != null){
				//fileString += '      WebElement webElement = webDriver.findElement(By.id("' + elementObject.id  + '");\n';
				fileString += '      page.clickElementById("' + elementObject.id  + '");\n' ;
			}
			else {
				//fileString += '      WebElement webElement = webDriver.findElement(By.xpath("' + elementObject.xpath  + '");\n';
				fileString += '      page.clickElementByXpath("' + elementObject.xpath  + '");\n' ;
			}
			//fileString += '      webElement.click();\n' ;
		}
		else if(elementObject.type == 'Link'){
			fileString += '   public void click'+elementObject.descriptiveName + '(){\n' ;		
			if (elementObject.name != null){
				//fileString += '      WebElement webElement = webDriver.findElement(By.name("'+ elementObject.name  + '");\n';
				fileString += '      page.clickElementByName("' + elementObject.name  + '");\n' ;
			}
			else if(elementObject.id != null){
				//fileString += '      WebElement webElement = webDriver.findElement(By.id("' + elementObject.id  + '");\n';
				fileString += '      page.clickElementById("' + elementObject.id  + '");\n' ;
			}
			else {
				//fileString += '      WebElement webElement = webDriver.findElement(By.xpath("' + elementObject.xpath  + '");\n';
				fileString += '      page.clickElementByXpath("' + elementObject.xpath  + '");\n' ;
			}
			//fileString += '      webElement.click();\n' ;
		}
		else if(elementObject.type == 'Input'){
			fileString += '   public void get'+elementObject.descriptiveName + '(){\n' ;		
			if (elementObject.name != null){
				//fileString += '      WebElement webElement = webDriver.findElement(By.name("'+ elementObject.name  + '");\n';
				fileString += '      page.getFieldValueByName("' + elementObject.name  + '");\n' ;
			}
			else if(elementObject.id != null){
				//fileString += '      WebElement webElement = webDriver.findElement(By.id("' + elementObject.id  + '");\n';
				fileString += '      page.getFieldValueById("' + elementObject.id  + '");\n' ;
			}
			else {
				//fileString += '      WebElement webElement = webDriver.findElement(By.xpath("' + elementObject.xpath  + '");\n';
				fileString += '      page.getFieldValueByXpath("' + elementObject.xpath  + '");\n' ;
			}
			//fileString += '       webElement.getAttribute("value")';
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
	fileString += '   public PageDriver page;\n\n';
	fileString += '   public SampleTestClass(PageDriver page) {\n';
	fileString += '			this.page = page;\n';
	fileString += '	  }\n';
	//fileString += '   private WebDriver driver;';
    for (var i = 0; i < elementObjects.length; i++){
		if (elementObjects[i].hasDescriptiveName == true){
			fileString += '/*\n' +elementObjects[i].descriptiveName + '\n*/\n';
		}
		else{
			fileString += '/*\n' +elementObjects[i].fullHTML + '\n*/\n';
		}
		fileString = SetupTesting(fileString, elementObjects[i]);
		fileString += '   }';
		fileString += '\n\n';
		if (elementObjects[i].type == 'Input'){
			fileString += '   public void set'+elementObjects[i].descriptiveName + '(String value){\n' ;
			if (elementObjects[i].name != null){
				//fileString += '      WebElement webElement = webDriver.findElement(By.name("' + elementObjects[i].name  + '");\n';
				fileString += '      page.typeValueInFieldByName("' + elementObjects[i].name  + '" , value);\n' ;
			}
			else if(elementObjects[i].id != null){
				//fileString += '      WebElement webElement = webDriver.findElement(By.id("' + elementObjects[i].id  + '");\n';
				fileString += '      page.typeValueInFieldById("' + elementObjects[i].id  + '" , value);\n' ;
			}
			else {
				//fileString += '      WebElement webElement = webDriver.findElement(By.xpath("' + elementObjects[i].xpath  + '");\n';
				fileString += '      page.typeValueInFieldByXpath("' + elementObjects[i].xpath  + '" , value);\n' ;
			}
			//fileString += '      webElement.sendKeys(value);\n' ;
			fileString += '   }';
			fileString += '\n\n';
		}
    }
	/*fileString += '    public void fill() {\n'
	for (var i = 0; i < elementObjects.length; i++){	
		if (elementObjects[i].type == 'Input'){
			fileString += '      set'+elementObjects[i].descriptiveName + '(String value){\n' ;
		}		
	}
	fileString += '   }\n';
	*/
///////// End of commented out code 
	fileString += '}';

    var blob = new Blob([fileString], {
        type: 'text/plain'
    });
    //console.log("Created Blob object.");

    return URL.createObjectURL(blob);

}

//=================================================== Jasmine (JavaScript Object) File ===========================================================

//TODO: Function to take sorted element object array, parse through, and create a Jasmine and/or Protractor compatable .js file and download it.
function createJSObject(outputFileHeader, elementObjects) {
    var fileString = '';
    fileString += '/*Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp + '*/';

    var blob = new Blob([fileString], {
        type: 'text/plain'
    });
    //console.log("Created Blob object.");

    return URL.createObjectURL(blob);
}

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
 * Function which calls the more abstract generateFileName(pageTitle, timeStamp) with the values used nearly every time
 *
 * @returns {string} - filename
 */
function generateFileNameDefault(){
    return generateFileName(outputFileHeader[0].pageTitle, outputFileHeader[0].timeStamp)
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
