import $ from 'jquery';
import _ from '_';
import Alt from 'alt';

var alt = new Alt(),
    NO_CACHE = 0,
    INFINITE_CACHE = -1;

export var alt = alt;
export var NO_CACHE = NO_CACHE;
export var INFINITE_CACHE = INFINITE_CACHE;

/**
 * Decorator for connect stores to a view
 * @param stores
 * @returns {Function}
 */
export var StoresComponent = function connectStores(stores) {
    return function decorator(target) {
        var componentDidMount = target.prototype.componentDidMount,
            componentWillUnmount = target.prototype.componentWillUnmount,
            events = [];

        // ComponentDidMount
        target.prototype.componentDidMount = function() {
            _.each(stores, (store) => {
                var event = () => {
                    var update = _.isUndefined(this.shouldStoreUpdate)?true:this.shouldStoreUpdate(store);
                    update && this.forceUpdate();
                };
                store.listen(event);
                events.push(event);
            });
            componentDidMount && componentDidMount.call(this);
        };

        // ComponentWillUnmount
        target.prototype.componentWillUnmount = function() {
            _.each(stores, (store, index) => {
                store.unlisten(events[index]);
            });
            events = [];
            componentWillUnmount && componentWillUnmount.call(this);
        };
    }
};

/**
 * Ajax Actions decorator
 */
export var AjaxActions = function AjaxActions(target) {
    target.prototype.sync = function(params) {
        return {params};
    }
};

/**
 * Ajax store decorator
 */
export var AjaxStore = function AjaxStore(options) {
    return function decorator(target) {
        var params = _.omit(options, 'cache');
        var cache = _.isUndefined(options.cache)?NO_CACHE:options.cache;
        var constructor = target.prototype.constructor;

        /**
         * Constructor
         */
        target.prototype.constructor = function() {
            this.bindActions(options.actions);
            this.state = {
                data: {},
                error: null
            };
            constructor.call(this);
        };

        /**
         * Sync
         */
        target.prototype.onSync = function(data) {
            // Cache
            if(this.cache === INFINITE_CACHE && this.state.data) {
                this.setState({
                    data: this.state.data,
                    error: this.state.error
                });
            }
            // Call
            else {
                // Setup
                var options = _.assign(params, data.params);
                options.url = _.isFunction(options.url)?options.url.call(this):options.url;

                $.ajax(options)
                    .done((data) => {
                        this.setState({
                            data: data,
                            error: null
                        });
                    })
                    .fail((data) => {
                        this.setState({
                            data: null,
                            error: data
                        });
                    });
            }

            return false;
        };
    }
};

export default alt;