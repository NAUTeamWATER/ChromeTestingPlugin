//For use of background page console! Usage: bkg.console.log('message!');
var bkg = chrome.extension.getBackgroundPage();

//After the DOM is loaded, add a button listener.
//Call the script that runs on the current tab enviroment.

document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
  	
  	
  	var outputCheckboxes = checkboxHandler();
  	
  	bkg.console.log(outputCheckboxes.length);
  	
  	if(outputCheckboxes.length <= 0) {
  		//Feedback that a output type must be selected.
  		document.getElementById('feedback').innerHTML = "<p>You must select an output file type!</p>";
  	}else {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    	chrome.tabs.executeScript(tabs[0].id, {
        	file: 'frontend.js'
    		}, function(){
        		chrome.tabs.sendMessage(tabs[0].id,{
            		outputCheckboxes: outputCheckboxes
        		});
    		});
	});
	}
     	
  }, false);
}, false);



function checkboxHandler(){
	var outputCheckboxes = [];
	
	if (document.getElementById('checkbox_xml').checked){	
		outputCheckboxes.push('xml');
		chrome.extension.getBackgroundPage().console.log('xml checked');
	}
	if (document.getElementById('checkbox_selenium').checked){	
		outputCheckboxes.push('selenium');
		chrome.extension.getBackgroundPage().console.log('selenium checked');
	}
	if (document.getElementById('checkbox_jasmine').checked){	
		outputCheckboxes.push('jasmine');
		chrome.extension.getBackgroundPage().console.log('jasmine checked');
	}
	
	return outputCheckboxes;
	
}
