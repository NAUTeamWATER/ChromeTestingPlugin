// Script that runs on the current tab enviroment.

var outputCheckboxes = [];

chrome.runtime.onMessage.addListener(getMessage);

//Get checkboxes from popup.js
function getMessage(message){
    outputCheckboxes = message.outputCheckboxes;    
    console.log("Frontend checkbox array length: "+outputCheckboxes.length);
    chrome.runtime.onMessage.removeListener(getMessage);
}
	
var outputData = "";

var timeStamp = new Date();

//Pull The page title.
var pageURL = window.location.href;
console.log(pageURL);

outputData +=  "Webpage elements retrieved from: " + pageURL+"\n";	
outputData += "at: "+ timeStamp +"\n";
outputData += "Page title: " + document.title;
outputData += "\n-----------------------------------\n";

retrieveElements();

//Send the output data to the background script enviroment though Chrome API message.	
chrome.runtime.sendMessage({outputData:outputData});
//chrome.runtime.sendMessage({outputCheckboxes:outputCheckboxes});

/**
 * Function which when called takes no parameters and retrieves all UI elements given a document DOM.
 * !! Will take an array as input and populates the given array with element objects. !!
 */
function retrieveElements(){
	var elements = document.getElementsByTagName("*");
	console.log("Found " +elements.length+" elements.");
	
	for (var i = 0; i < elements.length; i++){

		switch ((elements[i].tagName).toLowerCase()){
			
			case "button":
				var buttonId = elements[i].getAttribute("id");
     			var buttonName = elements[i].getAttribute("name");
     		
     			outputData += "Type: button\n";
     			outputData += "ID: "+buttonId+"\n";
				outputData += "Name: "+buttonName+"\n\n";
				break;
			
			case "input":
				var inputId = elements[i].getAttribute("id");
     			var inputName = elements[i].getAttribute("name");
     		
     			outputData += "Type: input\n";
     			outputData += "ID: "+inputId+"\n";
				outputData += "Name: "+inputName+"\n\n";
				break;
		}
	}
}
	

