
//After the DOM is loaded, add a button listener.
//Call the script that runs on the current tab enviroment.

document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
     
     chrome.tabs.executeScript({
    	file: 'frontend.js'
  	}); 
     
    //});
  }, false);
}, false);