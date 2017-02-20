//For use of background page console! Usage: bkg.console.log('message!');
var bkg = chrome.extension.getBackgroundPage();

//After the DOM is loaded, add a button listener.
//Call the script that runs on the current tab enviroment.

document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', function() {

        //Get user checkbox data;
        var checkboxData = checkboxHandler();
        //var checkboxData = [];

        if (checkboxData[0].length <= 0) {
            //Feedback that a output type must be selected, if not send user feedback to popup window.
            //JOHN implement this betters (:
            document.getElementById('feedback').innerHTML = "<p>You must select an output file type!</p>";
        } else {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                chrome.tabs.executeScript(tabs[0].id, {
                    file: 'middleware.js'
                }, function() {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        checkboxData: checkboxData
                    });
                });
            });
        }

    }, false); //Button listener

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
    for (var i = 0, max = getInputs.length; i < max; i++) {
        if (getInputs[i].type === 'checkbox') getInputs[i].checked = true;
    }

}, false); //DOMContentLoaded Listener



/* Two functions that selects or unselects
all of the checkboxes for the elements */
function selectAll() {
    var getInputs = document.getElementsByClassName("element_checkbox");
    for (var i = 0, max = getInputs.length; i < max; i++) {
        if (getInputs[i].type === 'checkbox') getInputs[i].checked = true;
    }
}

document.getElementById('selectAll').addEventListener('click', selectAll);

function unselectAll() {
    var getInputs = document.getElementsByClassName("element_checkbox");
    for (var i = 0, max = getInputs.length; i < max; i++) {
        if (getInputs[i].type === 'checkbox') getInputs[i].checked = false;
    }
}

document.getElementById('unselectAll').addEventListener('click', unselectAll);


// For JASON to work on :P
// I made a single function to get both kinds of checkboxes, (file output types and element types)
//This can be made into 2 if you desire, just note having a SINGLE array to use in the chrome message is important.
//Please keep files in index 0 and elements in index 1 of this array as well as this order matters in the middleware.
//Also the console logs were for intial testing purposes, you can remove them or comment them out.
function checkboxHandler() {
    var outputFileCheckboxes = [];
    var elementsToBeParsedCheckboxes = [];
    var checkboxData = [];

    if (document.getElementById('fileoutput_xml').checked) {
        outputFileCheckboxes.push('xml');
        bkg.console.log('xml checked');
    }
    if (document.getElementById('fileoutput_selenium').checked) {
        outputFileCheckboxes.push('selenium');
        bkg.console.log('selenium checked');
    }
    if (document.getElementById('fileoutput_jasmine').checked) {
        outputFileCheckboxes.push('jasmine');
        bkg.console.log('jasmine checked');
    }

    //Construct single array for Chrome messaging.
    checkboxData[0] = outputFileCheckboxes;
    checkboxData[1] = elementsToBeParsedCheckboxes;

    return checkboxData;

}
