import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';
import Data from 'components/app/projectsData';
import ProjectItem from './project-item/';
import 'gsap';

var visibleRaws = 3;

@i18nComponent
export default class Home extends React.Component {
    constructor(props) {
        super(props);

        assets.add(() => {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, 200);
            });
        });
        
        this.offsetLeft = 0;
        this.index = visibleRaws - 1;
        this.dom = {};
        this.items = [];
    }

    componentDidMount() {
        this.dom.projectList = React.findDOMNode(this.refs.projectList);
        _.forEach(Data, (item, key) => {
            this.dom['projectItem'+key] = React.findDOMNode(this.refs['projectItem'+key]);
            this.items.push({
                ref : this.refs['projectItem'+key],
                dom : this.dom['projectItem'+key],
                visible : key < 3 ? true : false
            });
        });
    }

    componentDidAppear() {
        console.log('appear');
        this.animateItems();
    }

    animateItems() {
        _.forEach(this.items, (item, key) => {
            key <= this.index ? item.ref.animationIn() : item.ref.animationOut();
        });
    }

    onWheel(e) {
        // console.log(e.deltaX);
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

    render() {
        var projects = Data.map((item, key) => {
            return (
                <ProjectItem ref={"projectItem"+key} data={{item : item, key : key}} />
            );
        });
        return (
            <div className="component home" onDrag={this.onWheel.bind(this)}>
                <div className="arrows">
                    <span onClick={this.goTo.bind(this,Home.direction.LEFT)}>Prev</span>
                    <span onClick={this.goTo.bind(this,Home.direction.RIGHT)}>Next</span>
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