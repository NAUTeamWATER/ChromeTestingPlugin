// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Element {

    //no constructor overloading, hence the setData() method
    constructor() {
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

}

//ToDo: reference to the element id or something unique so it can tell if it has been modified before
//ToDo: method to organize array of these objects in order

// Old deprecated code for < ES6 classes

// function Element() {
//     this.name = null;
//     this.id = null;
//     this.xpath = null;
//     this.description = null;
// };
//
// Element.prototype.setData = function(name, id, xPath) {
//     this.name = name;
//     this.id = id;
//     this.xpath = xPath;
// };