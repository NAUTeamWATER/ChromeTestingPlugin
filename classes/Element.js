// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Element {

    //no constructor overloading, hence the setData() method
    constructor(doc_element, uniqueID) {
        this.doc_element = doc_element;
        this.uniqueID = uniqueID;
        this.parsed = false;

        //ToDo: keep basics or not and delegate to helper methods?
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

    //ToDo: reference to the element id or something unique so it can tell if it has been modified before
    setParsed() {
        if (!this.parsed) this.parsed = true;
    }

    getParsedAlready() {
        return this.parsed;
    }

    toString(){
        //ToDo
    }

    static greaterThan(){
        //ToDo: method to organize array of these objects in order
    }

    //ToDo: Helper methods for each subsection (basic/jquery/etc)

}