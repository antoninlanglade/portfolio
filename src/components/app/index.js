import React from 'react';
import ReactDOM from 'react-dom';
import {Localize, Link, router, Loader} from 'dan';
import 'gsap';
import './styles.scss';
import Header from 'components/app/header';
import Footer from 'components/app/footer';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 'div',
            params: {}
        };
        this.rand = parseInt(Math.random()*1000);
        this.loader = new Loader({
            $elContainer : '#loader'
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

    render() {
        return (
            <div className="page">
                <this.state.content {...this.state.params}/>
            </div>
        );
    }
}

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 'div'
        }
    }

    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this);
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

    /**
     * Set content page
     * @param {React.Component} view
     * @param {Object} [params] URL Parameters
     */
    setPage(view, params) {
        var current = this.currentPage,
            next = this.nextPage;

        // New content
        if(current.content != view) {
            next.setContent(view, params);

            // Animation
            next.el.style.opacity = 0;
            TweenMax.killTweensOf([
                current.el,
                next.el
            ]);
            TweenMax.to(current.el, .25, {
                opacity: 0,
                onComplete: function() {
                    current.setContent('div', params);
                    current.el.style.display = 'none';
                    next.el.style.display = '';
                    TweenMax.to(next.el, .25, {
                        opacity: 1
                    });
                }
            });

            // Swap
            this.currentIndex = (this.currentIndex + 1) % this.pages.length;
        }
    }

    shouldComponentUpdate(props, state) {
        return false;
    }

    render() {
        this.pages = [];
        return (
            <div className="component app">
                <Header />
                <Page ref="p0" />
                <Page ref="p1" />
                <Footer />
            </div>
        );
    }
}