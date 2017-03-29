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

/**
 * Function to add slider functionality for options.
 */
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



/**
 * Function to select all element attribute checkboxes.
 */
function selectAll() {
    var getInputs = document.getElementsByClassName("element_checkbox");
    for (var i = 0; i < getInputs.length; i++) {
        if (getInputs[i].type === 'checkbox') getInputs[i].checked = true;
    }
}

/**
 * Function to deselect all element attribute checkboxes.
 */
document.getElementById('selectAll').addEventListener('click', selectAll);

function unselectAll() {
    var getInputs = document.getElementsByClassName("element_checkbox");
    for (var i = 0; i < getInputs.length; i++) {
        if (getInputs[i].type === 'checkbox') getInputs[i].checked = false;
    }
}

document.getElementById('unselectAll').addEventListener('click', unselectAll);


/**
 * Function to pull all elements from the checkboxes and put them into a single array.
 *
 * @returns {array} - The array of arrays of output file and element attributes selected on the GUI.
 */
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

/**
 * Helper function to pull all file output types and elements meant to be parsed.
 *
 * @param input - The input array of strings.
 * @param output - The output array of strings.
 */
function checkboxintoarray(input, output) {
    for (var i = 0; i < input.length; i++) {
        if (input[i].checked) {
            if (input[i] != other) {
                output.push(input[i].id);
            }
        } else if (input[i] == other) {
            break;
        }
    }
}
