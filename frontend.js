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

retrieveElements();

/**
 * Function which when called takes no parameters and retrieves all UI elements given a document DOM.
 * !! Will take an array as input and populates the given array with element objects. !!
 */
function retrieveElements(){
	var elements = document.getElementsByTagName("*");
	console.log("Found " +elements.length+" elements.");
	
	for (var i = 0; i < elements.length; i++){

		switch ((elements[i].tagName).toLowerCase()){

			//ToDo: typecast to element objects and then have delegation methods for each type of parsing
			// Example:
			// elements[i] = new Element();
            //
			// basicElements(); //button, links, input, etc //intuitive UI things
			// xPath(); //xpaths for all items (keep here, or elsewhere, internally?)
            // angularStuff(); //ngClick
            // jquery(); //?
            // javascript(); //onClick //odd uses, e.g. apply method post click to change page

			//long term: inject css to highlight/label items analyzed

			//checkboxes more in-depth for enabling elements
					//all checked by default
				//quality of life
					//select/deselect all
					//other category for random objects
				//extra
					//save selections (cookie?)
					//error checking

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
	
//Send the output data to the background script environment though Chrome API message.
chrome.runtime.sendMessage(outputData);

//ToDo: send Object[] (and string message of checkboxes for output file types)
