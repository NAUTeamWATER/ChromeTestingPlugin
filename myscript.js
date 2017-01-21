// Script that runs on the current tab enviroment.

	
var outputData = "";

//Pull The page title.	
outputData += "Page title: " + document.title;
outputData += "\n-----------------------------------\n";
	
//Get all buttons form the current page.	
var elems = document.body.getElementsByTagName("button");

//Iterate through the buttons, get the id's from the buttons. If no id exists, print that there is no id set.	
for (var i = 0; i < elems.length; i++) {
		
	var elem = elems[i];
	var elemId = elem.getAttribute('id');
	if(elemId == null){
		outputData += "Id is not set for element.";
	}else{
		outputData += elemId;
	}		
		
	outputData += "\n-----------------------------------\n";
}
	
//Send the output data to the background script enviroment though Chrome API message.	
chrome.runtime.sendMessage(outputData);
