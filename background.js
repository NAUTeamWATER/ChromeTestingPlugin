// The extension background enviroment as specified in the manifest.

// Retrieve the message sent from popup.js and alert the response.
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {

	var blob = new Blob([response], {type: 'text/plain'});
	console.log("Created Blob object.");
	
	objectURL = URL.createObjectURL(blob);
	console.log("Made link from Blob object.");
	
	download(objectURL, "water_plugin_test.txt")
	
	
	/**
	 * Function that takes an objectURL and a string fileName and makes use of the ChromeAPI download to 
	 * download the object as a file.
 	 * @param {Object} objectURL
 	 * @param {Object} fileName
	 */
	function download (objectURL, fileName){
		chrome.downloads.download({url: objectURL, filename: fileName},
       	function(id) {
     	});
	}
	
	
	 
	
	//alert(response);
});
