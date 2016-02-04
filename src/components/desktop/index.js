import React from 'react';
import ReactDOM from 'react-dom';
import {Localize, Link, router, Loader, assets, i18n, ensure} from 'dan';
import 'gsap';
import './styles.scss';
import Header from 'desktop/header';
import Footer from 'desktop/footer';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 'div',
            params: {}
        };
        this.rand = parseInt(Math.random()*1000);
    }

    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this);
    }

    componentWillUnmout() {
        this.el = null;
    }

    setContent(view, params) {
        params = params || {};
        this.setState({
            content: view,
            params: params
        });
    }

    get content() {
        return this.state.content;
    }

    get component() {
        return this.refs.component;
    }

    render() {
        return (
            <div className="page">
                <this.state.content {...this.state.params} ref="component"/>
            </div>
        );
    }
}

export default class DesktopApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 'div'
        }
        this.firstLoad = true;
        this.DOM = {};
    }

    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this);
        this.DOM.pages = ReactDOM.findDOMNode(this.refs.pages);
        this.currentIndex = 0;
        this.pages = [
            this.refs.p0,
            this.refs.p1
        ]
    }

    componentWillUnmount() {
        this.el = null;
        this.current = null;
        this.next = null;
    }

    get currentPage() {
        return this.pages[this.currentIndex];
    }

    get nextPage() {
        return this.pages[(this.currentIndex + 1) % this.pages.length];
    }

    goto(route, params) {
        ensure(route+'Desktop').then((Component) => {
          this.setPage(Component, {
            index: route === "project" ? params.projectId : null
          });
        });
    }

    /**
     * Set content page
     * @param {React.Component} view
     * @param {Object} [params] URL Parameters
     */
    setPage(view, params) {

        var current = this.currentPage,
            next = this.nextPage;

        // New content
        next.setContent(view, params);

        // Animation
        TweenMax.killTweensOf([
            current.el,
            next.el
        ]);
        
        current.component.componentWillUnAppear && current.component.componentWillUnAppear();
        
        if (this.firstLoad) {
            this.firstLoad = false;
            current.setContent('div', params);
            current.el.style.display = 'none';
            
            TweenMax.to(this.el,1, {
                width : "100%",
                onComplete : () => {
                    TweenMax.to(this.DOM.pages, .5, {
                        width : "80%",
                        onComplete : () => {
                            this.refs.header.componentDidAppear();
                            next.component && next.component.componentDidAppear && next.component.componentDidAppear();
                            this.refs.footer && this.refs.footer.componentDidAppear();
                        }
                    });
                }
            });
        }
        else {
            TweenMax.to(current.el, .35, {
                onComplete: () => {
                    current.setContent('div', params);
                    current.el.style.display = 'none';
                    next.el.style.display = '';
                    TweenMax.to(next.el, .25, {
                        onComplete : () => {
                            next.component && next.component.componentDidAppear && next.component.componentDidAppear();
                        }
                    });
                }
            });
        }
        
        // Swap
        this.currentIndex = (this.currentIndex + 1) % this.pages.length;
        
    }

    shouldComponentUpdate(props, state) {
        return false;
    }

    render() {
        this.pages = [];
        return (
            <div className="component app">
                <Header ref="header"/>
                <div className="pages" ref="pages">
                    <Page ref="p0" />
                    <Page ref="p1" />
                </div>
                <Footer ref="footer"/>
            </div>
        );
    }
}