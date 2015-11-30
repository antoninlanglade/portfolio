import _ from '_';

var log = function() {};
var warn = function() {};

if(console && console.log) {
    log = Function.prototype.bind.call(console.trace?console.trace:console.log, console);
}
if(console && console.warn) {
    warn = Function.prototype.bind.call(console.warn, console);
}

var ADD = 0,
    REMOVE = 1;

class Logger {
    constructor() {
        this.filters = [];
        this.enable = true;
        window.logger = this;
    }

    /**
     * Log arg in the console
     */
    log() {
        this.print(arguments, log);
    }
    
    /**
     * Warn arg in the console
     */
    warn() {
        this.print(arguments, warn);
    }

    /**
     * Print data in the function
     * @param {Array} data
     * @param {function} fn
     */
    print(data, fn) {
        if(this.enable) {
            var allow = false,
                cat = data[0];

            // Filter
            _.each(this.filters, function(filter) {
                if(filter.value === '*' || filter.value === cat) {
                    allow = filter.action === ADD;
                }
            });

            // Print
            if(allow && fn) {
                data[0] = '['+data[0]+']';
                fn.apply(console, data);
            }
        }
    }

    /**
     * Allow
     * @param {string|array} cat
     */
    show(cat) {
        this._addAction(cat, ADD);
    }

    /**
     * Hide cat
     * @param {string} cat
     */
    hide(cat) {
        this._addAction(cat, REMOVE);
    }

    /**
     * Add a new action
     * @param {string} value
     * @param {int} action
     * @private
     */
    _addAction(value, action) {
        if(value === '*') {
            this.filters = [];
        }

        this.filters.push({
            action: action,
            value: value
        });
    }
}

export var logger = new Logger();
export default logger;