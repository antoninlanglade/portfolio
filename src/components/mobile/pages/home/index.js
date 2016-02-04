import React from 'react';
import ReactDOM from 'react-dom';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';
import ProjectItem from './project-item/';
import {AnimationComponent} from 'tools/animation';
import 'gsap';
import rebound from 'rebound';


@i18nComponent
@AnimationComponent
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        
        this.offsetLeft = 0;
        
        this.dom = {};
        this.data = {};
        this.items = [];
        this.sync();
        
    }

    sync() {
        this.data = i18n.localize('data', null, 'data', i18n.locale);
    }

    componentDidMount() {
        this.dom.projectList = ReactDOM.findDOMNode(this.refs.projectList);
        this.dom.el = ReactDOM.findDOMNode(this);
        _.forEach(this.data, (item, key) => {
            this.dom['projectItem'+key] = ReactDOM.findDOMNode(this.refs['projectItem'+key]);
            this.items.push({
                ref : this.refs['projectItem'+key],
                dom : this.dom['projectItem'+key]
            });
        });
    }

    componentDidAppear() {
        this.animateItems(Home.direction.IN);
    }

    componentWillUnAppear() {
        this.animateAllOut();
    }

    componentWillUnmount() {
      
    }

    animateItems(direction) {
        _.forEach(this.items, (item, key) => {
            direction === Home.direction.IN ? item.ref.animationIn() : direction === Home.direction.OUT ? item.ref.animationOut() : null;
        });
    }


    animateAllOut(callback) {
         _.forEach(this.items, (item) => {
            item.ref.animationOut();
         });
         callback && setTimeout(callback, 350);
    }

    render() {
        var projects = this.data.map((item, key) => {
            return (
                <ProjectItem ref={"projectItem"+key} data={{item : item, key : key}} key={key}  animationOut={this.animateAllOut.bind(this)}/>
            );
        });
        return (
            <div className="component home">
                <div className="shortDescription">
                    <Localize>short-description</Localize>
                </div>
                <div className="links">
                    <Link route="about"><Localize>about</Localize></Link>
                    <Link href="https://twitter.com/antoninlanglade" target="blank">Twitter</Link>
                    <Link href="https://github.com/antoninlanglade" target="blank">Github</Link>
                </div>
                <ul className="project-list" ref="projectList">
                    <div className="someWork">
                        <img className="arrowBottom" src={config.path+'img/arrow.svg'} alt="arrow"/>
                        <Localize>some-work</Localize>
                    </div>
                    {projects}
                </ul>
            </div>
        );
    }
}
Home.direction = {
    LEFT : 1,
    RIGHT : 2,
    IN : 3,
    OUT : 4
}