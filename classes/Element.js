// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

/**
 * Wrapper class for DOM elements that contains a UUID (unique ID), as well as fields and helper methods.
 */
class Element {

    //no constructor overloading, hence the setData() method
    constructor(doc_element, uniqueID) {
        this.doc_element = doc_element; //HTMLCollection
        this.uniqueID = uniqueID;
        this.parsed = false;

        //ToDo: keep basic values here as fields or delegate to helper methods?
        this.name = null;
        this.id = null;
        this.xpath = null;
        this.description = null;
    }

    setData(name, id, xPath) {
        this.name = name;
        this.id = id;
        this.xpath = xPath;
    }

    toJSON(){
        return {
            'Name': this.name,
            'ID': this.id,
            'XPath': this.xpath
        };
    }

    /**
     * To allow checking of parsing status to know if it has been analyzed already
     */
    setParsed() {
        if (!this.parsed) this.parsed = true;
    }

    /**
     * To allow checking of parsing status to know if it has been analyzed already
     * @returns {boolean} - this.parsed
     */
    isParsedAlready() {
        return this.parsed;
    }

    /**
     * Helper method for simple stringification
     */
    toString(){
        return "Element "+"\nID: "+this.id+"\nName: "+this.name;
        //ToDo
    }

    static greaterThan(){
        //ToDo: method to organize array of these objects in order
    }

    //ToDo: Helper methods for each subsection (basic/jquery/etc)

}

// export default { Element };