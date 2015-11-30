import React from 'react';
import _ from '_';
import {i18n} from 'dan/i18n';

var defaultFile;

export class Localize extends React.Component {
    constructor(props) {
        super(props);

        this.sync = this.sync.bind(this);
        this.sync();
    }

    static get defaultFile() {
        return defaultFile;
    }

    static set defaultFile(file) {
        defaultFile = [file];
    }

    componentDidMount() {
        i18n.addListener('change', this.sync);
    }

    componentWillUnmount() {
        i18n.removeListener('change', this.sync);
    }

    componentWillReceiveProps(props) {
        this.sync(props);
    }

    /**
     * Sync component
     * @param {object} [props]
     */
    sync(props) {
        props = props || this.props;
        this.text = (() => {
            if (!i18n.hasFile(props.file, props.locale)) {
                i18n.sync(props.locale, props.file?props.file:defaultFile).then(() => {
                    this.text = props;
                });
                return null;
            }
            return props;
        })();
        return this.text;
    }

    /**
     * Setter text
     * @param {string|object} data Set the text if data is a string, set automatically is data is null, set automatically with props parameter if data is an object
     */
    set text(data) {
        var props = _.isObject(data) ? data : this.props,
            text = _.isString(data) ? data : null,
            state = _.omit(props, 'children');

        state.dangerouslySetInnerHTML = { __html: text || i18n.localize(props.children, props, props.file, props.locale) };
        (this.state && this.setState(state)) || (this.state = state);
    }

    /**
     * Getter text
     * @returns {String}
     */
    get text() {
        return this.state.text;
    }

    render() {
        return (
            <span {...this.state}></span>
        );
    }
}

/**
 * Decorator i18n for react component
 */
export var i18nComponent = function(target) {
    var componentDidMount = target.prototype.componentDidMount,
        componentWillUnmount = target.prototype.componentWillUnmount,
        event;

    // ComponentDidMount
    target.prototype.componentDidMount = function() {
        event = () => {
            this.forceUpdate();
        };

        i18n.on('change', event);

        componentDidMount && componentDidMount.call(this);
    };

    // ComponentWillUnmount
    target.prototype.componentWillUnmount = function() {
        i18n.off('change', event);

        componentWillUnmount && componentWillUnmount.call(this);
    };
};