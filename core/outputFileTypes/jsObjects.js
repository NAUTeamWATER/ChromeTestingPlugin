//=================================================== JavaScript Objects (Jasmine) File ===========================================================


//======= JS Helper Functions ==========

// Useful variables
const INDENT = "    "; //4 spaces
const DOUBLE_INDENT = INDENT+INDENT;
const CLASS_NAME = "ParsedDOMElement"; //Name of the class in the file
let CLASS_PARAMS = []; //The parameters used in this class
const CLASS_PARAM_START_INDEX = 3; //The index of parameters passed to start. 3 => skips hasDescriptiveName, descriptiveName and fullHTML

// Create the JavaScript class to hold the parsed DOM elements
function createClass(elementObjects) {

    // String to hold class data
    let fileString = "\n\n";

    // Use class keyword to create it
    fileString += "// A class to hold the parsed UI elements. \n// See the constructor comments below for detailed information.\n";
    fileString += "class "+CLASS_NAME+" { \n\n";

    // Arrow operator for simple anonymous function to add keys of JSON object to array
    let classParamSetup = x => { for (let prop in elementObjects[0]) { x.push(prop); } }; //<- Key, Value is elementObject[prop]
    classParamSetup(CLASS_PARAMS);
    CLASS_PARAMS = CLASS_PARAMS.slice(CLASS_PARAM_START_INDEX); //remove unused elements


    // ======== Constructor ========

    // Add comments to the constructor describing them
    fileString += INDENT+"//type = The type of the element. Can be  Angular (ng-click), Button, Javascript (on-click), Input, or Link.\n";
    fileString += INDENT+"//clazz = The class of the HTML tag. E.g. <...class='col-md-3 col-xs-12 component-col'...>. It is assigned 'null' if it doesn't exist.\n";
    fileString += INDENT+"//id = The ID of the HTML tag. E.g. <...id='x'...>. It is assigned 'null' if it doesn't exist.\n";
    fileString += INDENT+"//name = The name of the HTML tag. E.g. <...name='x'...>. It is assigned 'null' if it doesn't exist.\n";
    fileString += INDENT+"//xpath = The xPath of the element. A generated value.\n";

    // Start the actual constructor
    fileString += INDENT+"constructor(";

    // Fill out params
    for (let i = 0; i < CLASS_PARAMS.length; i++) {
        if (i === CLASS_PARAMS.length - 1) { //Last item
            fileString += CLASS_PARAMS[i]+ ") {\n"; //Finish constructor
        } else {
            fileString += CLASS_PARAMS[i]+", "; //Trailing comma
        }
    }

    // Assign values
    for (let i = 0; i < CLASS_PARAMS.length; i++) {
        if (i === CLASS_PARAMS.length - 1) { //Last item
            fileString += DOUBLE_INDENT + "this." + CLASS_PARAMS[i] + " = " + CLASS_PARAMS[i] + ";"; //No new line
        } else {
            fileString += DOUBLE_INDENT + "this." + CLASS_PARAMS[i] + " = " + CLASS_PARAMS[i] + ";\n";//New line
        }
    }

    // Finish constructor
    fileString += "\n"+INDENT+"}\n"; //End constructor

    // Finish class
    fileString += "\n}\n\n"; //End class

    // Return string
    return fileString;
}

// Instantiate the objects using the class made above, plus the data from each element of course
function instantiateObjects(elementObjects) {

    // String to hold object instantiation data
    let fileString = "// All of the instantiated elements, with the parsed data from each, are below.\n";

    // Loop through all parsed elements
    for (let i = 0; i < elementObjects.length; i++) {

        // The name to use when instantiating the object
        let varName = "";
        if (elementObjects[i].hasDescriptiveName) {
            varName = elementObjects[i].descriptiveName; //If has a unique name use it
        } else {
            varName = "NoUniqueName"; //Otherwise create a unique name //ToDo: SomethingBetter
        }

        // Start instantiation
        fileString += "let "+varName+" = new "+CLASS_NAME+"(";

        // Fill out constructor with relevant info
        // Logic: value = elementObject[key] == elementObjects[i][key] == elementsObjects[i][CLASS_PARAM[j]]
        let value = "";
        for (let j = 0; j < CLASS_PARAMS.length; j++) {

            //Typing = if null do null, otherwise wrap in quotes as a string
            if (elementObjects[i][CLASS_PARAMS[j]] === null) {
                value = null;
            } else {
                value = "\'" + elementObjects[i][CLASS_PARAMS[j]] + "\'"; //encapsulate in quotes (has to be single because xpath uses double internally)
            }

            if (j === CLASS_PARAMS.length - 1) { //Last item
                fileString += value + ");\n\n"; //Finish instantiation
            } else {
                fileString += value + ", "; //Trailing comma
            }

        }

    }

    //Return string
    return fileString;
}


//======= Main JS Function =============

function createJSObjectsFile(outputFileHeader, elementObjects, headerStringArray) {

    // Create a string to hold the data in the file
    let fileString = '';

    // Header info
    fileString += '//'+headerStringArray[0];
    fileString += '//'+headerStringArray[1]+"\n";

    // Page data
    fileString += createClass(elementObjects);
    //ToDo: Include Enum?
    fileString += instantiateObjects(elementObjects);

    // Create a blob object to store the new file
    const blob = new Blob([fileString], {
        type: 'text/plain'
    });

    // Return the  blob so that it can be downloaded
    return blob;
}