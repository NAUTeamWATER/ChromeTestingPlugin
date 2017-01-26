// Script that runs on the current tab enviroment.
	
var outputData = "";

var timeStamp = new Date();

//Pull The page title.
var pageURL = window.location.href;
console.log(pageURL);

outputData +=  "Webpage elements retrieved from: " + pageURL+"\n";	
outputData += "at: "+ timeStamp +"\n";
outputData += "Page title: " + document.title;
outputData += "\n-----------------------------------\n";


//This is what we need to work on!
//var buttons = new Array();

/*var allElements = document.getElementsByTagName("*");

console.log("Found " +allElements.length+" elements.");

outputData += "Buttons:\n";

for (var i = 0; i < allElements.length; i++) {
		
    if ((allElements[i].tagName).toLowerCase() == "button"){
    	
     	var buttonId = allElements[i].getAttribute("id");
     	var buttonName = allElements[i].getAttribute("name");
     	
     	
		outputData += "ID: "+buttonId+"\n";
		outputData += "Name: "+buttonName+"\n\n";
			
     } 
}*/
	
//Send the output data to the background script enviroment though Chrome API message.	
chrome.runtime.sendMessage(outputData);
