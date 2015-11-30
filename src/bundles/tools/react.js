import React from 'react';
import ReactDOM from 'react-dom';
import _ from '_';

export default class ReactTools {
    /**
     * Set elements to the ref
     * @param {Array<React.Element>} elements
     * @param {Array<React.Component>} container
     */
    static elementsToComponents(elements, container) {
        var size = elements.length - 1;
        container.splice(0, container.length);
        return elements.map(function(element, index) {
            return React.cloneElement(element, {
                key: name+index,
                ref: function(ref) {
                    // Mount
                    if(ref) {
                        container.push(ref);
                    }
                    // Unmount
                    else if(index >= size) {
                        container.splice(0, container.length);
                    }
                }
            });
        });
    }

    /**
     * Get DOM elements from components
     * @param {Array} components
     * @return {Array}
     */
    static componentsToDOM(components) {
        var output = _.isArray(components)?[]:{};
        _.each(components, function(value, id) {
            value && (output[id] = value.render?ReactDOM.findDOMNode(value):find(value));
        });
        return output;
    }
}