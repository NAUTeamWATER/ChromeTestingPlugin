// The extension background enviroment as specified in the manifest.

// Retrieve the message sent from popup.js and alert the response.
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {

/* I wanted to write the output to a file and have it download, 
 * but this seems tricky to do in an extension with javascript.
 * 
 * This is where we could put a HTTPS request to sent the data, either the full HTML script to be parsed, 
 * or the already parsed data to be configured and written to a file which then could be downloaded from the extension.
 */
	var blob = new Blob([response], {type: 'text/plain'});
	console.log("Created Blob object.");
	
	objectURL = URL.createObjectURL(blob);
	console.log("Made link from Blob object.");
	
	 chrome.downloads.download({url: objectURL, filename: "water_plugin_test.txt"},
                                             function(id) {
      });
	
	alert(response);
});
