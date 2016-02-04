import React from 'react';
import ReactDOM from 'react-dom';
import {Localize, Link, router, Loader, assets, i18n, ensure} from 'dan';
import Config from 'config';
import Signal from 'signals';

var TYPE = {
    DESKTOP: 'desktopApp',
    MOBILE: 'mobileApp'
};

var components = {};

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            media: '',
            mediaComponent: 'div'
        };
        this.route = null;
        this.params = null;
        this.updateSignal = new Signal();
        this.matchMedia = window.matchMedia("screen and (max-width:"+Config.mobileWidth+"px)");
    }

    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this);
        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize();
    }

    componentWillUnmount() {
        this.el = null;
    }

    /**
     * Resize handler
     */
    onResize() {
        var isMobile = this.matchMedia.matches,
            media = isMobile?TYPE.MOBILE:TYPE.DESKTOP;

        var swap = () => {
            var container = document.getElementById('container');
            container.className = media;
            this.setState({
                media: media,
                mediaComponent: components[media]
            }, () => {
                this.app.firstLoad = true;
                if(this.app.goto && this.route) {
                    this.goto(this.route, this.params);
                }
            });
        };

        if(this.state.media !== media) {
            if(components[media]) {
                swap();
            }
            else {
                ensure(media).then((Component) => {
                    components[media] = Component;
                    swap();
                });
            }
        }
    }

    goto(route, params) {
        this.route = route;
        this.params = params;        
        this.app.goto && this.app.goto.apply(this.app, arguments);
    }

    componentDidUpdate() {
        this.updateSignal.dispatch();
    }

    shouldComponentUpdate(props, state) {
        var update = this.state.media !== state.media;
        update && logger.log('app', state.media === TYPE.MOBILE?'Mobile':'Desktop');
        return update;
    }



    render() {
        return (
            <this.state.mediaComponent ref={(el) => { this.app = el; }}/>
        );
    }
}