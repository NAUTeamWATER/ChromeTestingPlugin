class InteractibleElement extends Element {

    constructor(docElement, uniqueId, type) {
        super(docElement, uniqueId);
        this.type = type;
    }

}

// ToDo: Enum for type (also rename to more descriptive than 'type')
// Enums: http://www.2ality.com/2016/01/enumify.html


// Old deprecated code for < ES6 classes

// function InteractibleElement(type) {
//     Element.call();
//     this.type = type;
// };
//
// InteractibleElement.prototype = Object.create(Element.prototype);
// InteractibleElement.prototype.constructor = InteractibleElement;