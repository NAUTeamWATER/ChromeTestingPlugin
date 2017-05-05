//For use of background page console. Usage: bkg.console.log('message!');
var bkg = chrome.extension.getBackgroundPage();

//After the DOM is loaded, add a button listener.
//Call the script that runs on the current tab environment.

// Get the button into a variable for ease of access
var checkPageButton = document.getElementById('checkPage');

/**
 * Add an event listener for clicking the button
 */
checkPageButton.addEventListener('click', function() {

    //Get user checkbox data;
    let checkboxData = checkboxHandler();

    // Error handling for no files selected
    if (checkboxData[0].length <= 0) {
        //Feedback that a output type must be selected, if not send user feedback to popup window.
        document.getElementById('feedback').innerHTML = "<p>You must select an output file type!</p>";

    // Error handling for no elements selected
    } else if (checkboxData[1].length <= 0) {
        document.getElementById('feedback').innerHTML = "<p>You must select an element!</p>";

    // No errors, pass data (selected checkboxes) to middleware
    } else {
        document.getElementById('feedback').innerHTML = "";
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
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

    let acc = document.getElementsByClassName("accordion");
    let i;

    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function() {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        }
    }

    //Check all elements
    let getInputs = document.getElementsByClassName("element_checkbox");
    for (i = 0; i < getInputs.length; i++) {
        if (getInputs[i].type === 'checkbox') getInputs[i].checked = true;
    }

}, false); //DOMContentLoaded Listener


/**
 * Function to select all element attribute checkboxes.
 */
function selectAll() {
    let getInputs = document.getElementsByClassName("element_checkbox");
    for (let i = 0; i < getInputs.length; i++) {
        if (getInputs[i].type === 'checkbox') getInputs[i].checked = true;
    }
}

document.getElementById('selectAll').addEventListener('click', selectAll);


/**
 * Function to deselect all element attribute checkboxes.
 */
function unselectAll() {
    let getInputs = document.getElementsByClassName("element_checkbox");
    for (let i = 0; i < getInputs.length; i++) {
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
    let outputFileCheckboxes = [];
    let elementsToBeParsedCheckboxes = [];
    let checkboxData = [];

    let getFileOutputs = document.getElementsByClassName("output_checkbox");
    let getElementTypes = document.getElementsByClassName("element_checkbox");

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
    for (let i = 0; i < input.length; i++) {
        if (input[i].checked) {
            output.push(input[i].id);
        }
    }
}
