//=================================================== XML File ===========================================================


/**
 * Create an XML file containing the element data.
 * Useful as a generalized, but clearly structured, file type.
 */
function createXMLFile(outputFileHeader, elementObjects) {

    // Create a string to hold the data in the file
    let fileString = '';

    // Header information
    fileString += '<?xml version="1.0" encoding="UTF-8"?>\n';
    fileString += '<!--Webpage elements retrieved from: ' + outputFileHeader[0].pageURL + ' at ' + outputFileHeader[0].timeStamp + '.-->';
    fileString += '<!-- Retrieved ' + elementObjects.length + ' elements from ' + elementsToBeParsedCheckboxes.length +' categories.-->';

    // Page data
    fileString += '<output>\n';
    fileString += '<page_data>\n';
    fileString += '\t<page_url>' + outputFileHeader[0].pageURL + '</page_url>\n';
    fileString += '\t<timestamp>' + outputFileHeader[0].timeStamp + '</timestamp>\n';
    fileString += '\t<page_title>' + sanitizeString(outputFileHeader[0].pageTitle) + '</page_title>\n';
    fileString += '</page_data>\n';

    // Element data
    fileString += '<elements>\n';

    //Loop through elements here, adding their info to the fileString in the appropriate tags
    for (let i = 0; i < elementObjects.length; i++){
      fileString += '\t<element>\n';
      fileString += '\t\t<element_type>' + elementObjects[i].type + '</element_type>\n';
      fileString += '\t\t<element_id>' + elementObjects[i].id + '</element_id>\n';
      fileString += '\t\t<element_name>' + elementObjects[i].name + '</element_name>\n';
      fileString += '\t\t<element_xpath>' + elementObjects[i].xpath + '</element_xpath>\n';
      fileString += '\t</element>\n';
    }

    // Close tags
    fileString += '</elements>\n';
    fileString += '</output>\n';

    // Create a blob object to store the new file
    const blob = new Blob([fileString], {
        type: 'text/plain'
    });

    // Return the URL of the blob so that it can be downloaded
    return URL.createObjectURL(blob);
}
