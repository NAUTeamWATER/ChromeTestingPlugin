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

parseElements(retrieveElements());

/**
 * Function which when called takes no parameters and retrieves all UI elements given a document DOM.
 * !! Will take an array as input and populates the given array with element objects. !!
 */
function retrieveElements(){

    //ToDo: if statements for toggling which elements to access
	var elements = document.getElementsByTagName("*");
	console.log("Found " +elements.length+" elements.");

	var elementArray = [];

    //random IDs
    var uuid = function () {
        var fourChars = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
        };
        return (fourChars() + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + fourChars() + fourChars());
    };

    //loop through all elements
    for (var i = 0; i < elements.length; i++) {
		//add a new Element type to the array
		elementArray.push(new Element(elements[i], uuid()));
	}

}

function parseElements(elementArray){

    //if (!elementArray[i].isParsedAlready())

    // basicElements(); //button, links, input, etc //intuitive UI things
    // xPath(); //xpaths for all items (keep here, or elsewhere, internally?)
    // angularStuff(); //ngClick
    // jquery(); //?
    // javascript(); //onClick //odd uses, e.g. apply method post click to change page

	//something to pass to sendMessage()
}
	
//Send the output data to the background script environment though Chrome API message.
chrome.runtime.sendMessage(outputData);

//ToDo: send Object[] (and string message of checkboxes for output file types)
