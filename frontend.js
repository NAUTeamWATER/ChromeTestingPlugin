//For use of background page console! Usage: bkg.console.log('message!');
var bkg = chrome.extension.getBackgroundPage();

//After the DOM is loaded, add a button listener.
//Call the script that runs on the current tab enviroment.


var checkPageButton = document.getElementById('checkPage');
checkPageButton.addEventListener('click', function() {

    //Get user checkbox data;
    var checkboxData = checkboxHandler();

    if (checkboxData[0].length <= 0) {
        //Feedback that a output type must be selected, if not send user feedback to popup window.
        document.getElementById('feedback').innerHTML = "<p>You must select an output file type!</p>";

    } else if (checkboxData[1].length <= 0) {
        document.getElementById('feedback').innerHTML = "<p>You must select an element!</p>";

    } else {
        document.getElementById('feedback').innerHTML = "";
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            //chrome.tabs.executeScript(tabs[0].id, {
            //      file: 'middleware.js'
            //  }, function() {
            chrome.tabs.sendMessage(tabs[0].id, {
                checkboxData: checkboxData
            }, function(response) {
                //Response code here...
            });
        });
    }

}, false); //Button listener


document.addEventListener('DOMContentLoaded', function() {
    //HTML JS for user interface//

    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        }
    }

    //Check all elements
    var getInputs = document.getElementsByClassName("element_checkbox");
    for (var i = 0; i < getInputs.length; i++) {
        if (getInputs[i].type === 'checkbox') getInputs[i].checked = true;
    }

}, false); //DOMContentLoaded Listener



/* Two functions that selects or unselects
all of the checkboxes for the elements */
function selectAll() {
    var getInputs = document.getElementsByClassName("element_checkbox");
    for (var i = 0; i < getInputs.length; i++) {
        if (getInputs[i].type === 'checkbox') getInputs[i].checked = true;
    }
}

document.getElementById('selectAll').addEventListener('click', selectAll);

function unselectAll() {
    var getInputs = document.getElementsByClassName("element_checkbox");
    for (var i = 0; i < getInputs.length; i++) {
        if (getInputs[i].type === 'checkbox') getInputs[i].checked = false;
    }
}

document.getElementById('unselectAll').addEventListener('click', unselectAll);


//Should pull all file types and elements meant to be parsed.
function checkboxintoarray(input, output) {
    for (var i = 0; i < input.length; i++) {
        if (input[i].checked) {
			if (input[i] != other){
				output.push(input[i].id);
			}
        }
    }
}

function checkboxHandler() {
    var outputFileCheckboxes = [];
    var elementsToBeParsedCheckboxes = [];
    var checkboxData = [];

    var getFileOutputs = document.getElementsByClassName("output_checkbox");
    var getElementTypes = document.getElementsByClassName("element_checkbox");

    checkboxintoarray(getFileOutputs, outputFileCheckboxes);
    checkboxintoarray(getElementTypes, elementsToBeParsedCheckboxes);
    //Construct single array for Chrome messaging.
    checkboxData[0] = outputFileCheckboxes;
    checkboxData[1] = elementsToBeParsedCheckboxes;

    return checkboxData;

}
