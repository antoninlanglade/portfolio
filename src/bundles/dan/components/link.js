import React from 'react';
import async from 'async';
import _ from '_';
import {router} from 'dan/router';
import {i18n} from 'dan/i18n';

export class Link extends React.Component {
    constructor(props) {
        super(props);

        this.router = router;
        this.sync = this.sync.bind(this);
        this.onClick = this.onClick.bind(this);
        this.sync();
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
     * Force component synchronise
     * @param props
     */
    sync(props) {
        var state = _.omit(props || this.props, 'children'),
            setHref = (href) => {
                href && (state.href = href);
                state.onClick = this.onClick;
                (this.state && this.setState(state)) || (this.state = state);
            };

        // Route
        if(state.route) {
            setHref(this.router.getRoute(state.route, state));
            if(state.locale || !this.router.hasLocale(state.locale)) {
                this.router.getRoute(state.route, state, state.locale || i18n.locale).then(setHref);
            }
        }
        // Href
        else {
            setHref(state.href || "#");
        }
    }

    /**
     * Trigger onClick event
     * @param e
     */
    onClick(e) {
        if(this.props.onClick && this.props.onClick(e) === false) {
            return false;
        }
        e.preventDefault();
        this.router.goto(e.currentTarget, this.props.target);
    }

    render() {
        return (
            <a {...this.state}>{this.props.children}</a>
        );
    }
}

/**
 * Decorator route for react component
 */
export var routerComponent = function(target) {
    var componentDidMount = target.prototype.componentDidMount,
        componentWillUnmount = target.prototype.componentWillUnmount,
        event;

    // ComponentDidMount
    target.prototype.componentDidMount = function() {
        event = () => {
            this.forceUpdate();
        };

        router.on('change', event);

        componentDidMount && componentDidMount.call(this);
    };

    // ComponentWillUnmount
    target.prototype.componentWillUnmount = function() {
        router.off('change', event);

        componentWillUnmount && componentWillUnmount.call(this);
    };
};