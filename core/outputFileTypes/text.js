//=================================================== Text File ===========================================================


/**
 * Create a text file containing the element data.
 * Initially created primarily for internal testing purposes, but it can be used for whatever is desired.
 */
function createTextFile(outputFileHeader, elementObjects, headerStringArray) {

    // Create a string to hold the data in the file
    let fileString = '';
    fileString += headerStringArray[0];
    fileString += headerStringArray[1];
    fileString += "\n";

    // Function to add elements to file
    function addElementsToString(fileString, elementObject) {
        fileString += JSON.stringify(elementObject, undefined, 2); //Deserialize and append to fileString
        fileString += "\n---\n"; //Break up elements visually
        return fileString;
    }

    // Add the elements to the fileString
    for (let i = 0; i < elementObjects.length; i++) {
        fileString = addElementsToString(fileString, elementObjects[i]);
    }

    // Create a blob object to store the new file
    const blob = new Blob([fileString], {
        type: 'text/plain'
    });

    // Return the blob
    return blob;

}