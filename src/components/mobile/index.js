import React from 'react';
import ReactDOM from 'react-dom';
import {Localize, Link, router, Loader, assets, i18n, ensure} from 'dan';
import 'gsap';
import './styles.scss';
import Config from 'config';
import Header from 'desktop/header';
import Footer from 'desktop/footer';
import _ from '_';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 'div',
            params: {}
        };
        this.rand = parseInt(Math.random()*1000);
        this.data = i18n.localize('data', null, 'data', i18n.locale);
        
        _.forEach(this.data, (project, index) => {
            assets.add(Config.path+project.content.images[0],'project-detail-'+index);
        });
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

export default class MobileApp extends React.Component {
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
        ensure(route+'Mobile').then((Component) => {
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
            setTimeout(() => {
                current.setContent('div', params);
                current.el.style.display = 'none';
                window.scrollTo(0,0);
                TweenMax.to(this.el,1, {
                    width : "100%",
                    onComplete : () => {
                        TweenMax.to(this.DOM.pages, .5, {
                            onComplete : () => {
                                next.component && next.component.componentDidAppear && next.component.componentDidAppear();
                            }
                        });
                    }
                });
            }, 500);
        }
        else {
            setTimeout(() => {
                TweenMax.to(current.el, .35, {
                    onComplete: () => {
                        current.setContent('div', params);
                        current.el.style.display = 'none';
                        next.el.style.display = '';
                        window.scrollTo(0,0);
                        TweenMax.to(next.el, .25, {
                            onComplete : () => {
                                next.component && next.component.componentDidAppear && next.component.componentDidAppear();
                            }
                        });
                    }
                });
            }, 500);
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
                <div className="pages" ref="pages">
                    <Page ref="p0" />
                    <Page ref="p1" />
                </div>
            </div>
        );
    }
}