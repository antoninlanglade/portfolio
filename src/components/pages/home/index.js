import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';
import ProjectItem from './project-item/';
import 'gsap';

var visibleRaws = 3;

@i18nComponent
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        
        this.offsetLeft = 0;
        this.index = visibleRaws - 1;
        this.dom = {};
        this.items = [];
        this.sync();
    }

    sync() {
        this.data = i18n.localize('data', null, 'data', i18n.locale);
    }

    componentDidMount() {
        this.dom.projectList = React.findDOMNode(this.refs.projectList);
        _.forEach(this.data, (item, key) => {
            this.dom['projectItem'+key] = React.findDOMNode(this.refs['projectItem'+key]);
            this.items.push({
                ref : this.refs['projectItem'+key],
                dom : this.dom['projectItem'+key],
                visible : key < 3 ? true : false
            });
        });
    }

    componentDidAppear() {
        this.animateItems();
    }

    componentWillUnmount() {
        
    }

    animateItems() {
        _.forEach(this.items, (item, key) => {
            key <= this.index ? item.ref.animationIn() : item.ref.animationOut();
        });
    }

    goTo(direction) {
        // If out of bounds
        if (!this.isItemWithDirection(this.index, direction)) {
            return;
        }
        
        if (direction === Home.direction.RIGHT) {
            this.offsetLeft++;
            this.index++;
            this.items[this.index].visible = true;
            for (var i = 0; i < this.items.length; i++) {
                if (i < this.index - (visibleRaws - 1)) {
                    this.items[i].visible = false;    
                }
            }
        }
        else if (direction === Home.direction.LEFT && this.index > visibleRaws - 1) {
            this.offsetLeft--;
            this.index--;
            this.items[this.index].visible = true;
            for (var i = 0; i < this.items.length; i++) {
                if (i < this.index + (visibleRaws - 1)) {
                    this.items[i].visible = false;    
                }
            }
        }
        this.animateItems();

        this.dom.projectList.style.transform = "translate3d("+(-this.offsetLeft*100/3)+"%, 0, 0)"
        
    }
    isItemWithDirection(index, direction) {
        var isItemAtPosition = false;
        _.forEach(this.items, (item, key) => {
            if (direction === Home.direction.RIGHT && index < key) {
                isItemAtPosition |= item.visible === false;    
            }
            else if (direction === Home.direction.LEFT && index > key) {
                isItemAtPosition |= item.visible === false;    
            }
        });
        return isItemAtPosition;
    }

    moveToBackground() {
        _.forEach(this.items, (item, key) => {
            item.dom.style.zIndex = 1;
        }); 
    }

    render() {
        var projects = this.data.map((item, key) => {
            return (
                <ProjectItem ref={"projectItem"+key} data={{item : item, key : key}} moveToBackground={this.moveToBackground.bind(this)}/>
            );
        });
        return (
            <div className="component home">
                <div className="arrows">
                    <span onClick={this.goTo.bind(this,Home.direction.LEFT)}><Localize>prev</Localize></span>
                    <span onClick={this.goTo.bind(this,Home.direction.RIGHT)}><Localize>next</Localize></span>
                </div>
                <ul className="project-list" ref="projectList">
                    {projects}
                </ul>
            </div>
        );
    }
}
Home.direction = {
    LEFT : 1,
    RIGHT : 2
}