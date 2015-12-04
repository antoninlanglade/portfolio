import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets, router} from 'dan';
import config from 'config';
import './styles.scss';

@i18nComponent
export default class ProjectItem extends React.Component {
    constructor(props) {
        super(props);
        this.animationState = ProjectItem.animationState.OUT;
        this.dom = {};
        this.onScroll = this.onScroll.bind(this);
    }

    componentDidMount() {
        this.dom.el = React.findDOMNode(this.refs.projectItem);
        window.addEventListener('scroll',this.onScroll);
    }

    animationIn() {
        if (this.animationState === ProjectItem.animationState.IN) {
            return;
        }
        this.animationState = ProjectItem.animationState.IN;
        this.dom.el.classList.remove('animationOut');
        this.dom.el.classList.add('animationIn');
    }

    animationOut() {
        if (this.animationState === ProjectItem.animationState.OUT) {
            return;
        }
        this.animationState = ProjectItem.animationState.OUT;
        this.dom.el.classList.remove('animationIn');
        this.dom.el.classList.add('animationOut');
    }

    openProject(index, e) {
        e.preventDefault();
        console.log(index);
        router.goto(router.getRoute(this.props.data.item.route));
    }

    onScroll(e) {

    }

    render() {
        var style = {
            right : 100/3*2 - (this.props.data.key * (100/3))+"%",
            background : this.props.data.item.color
        };
        return (
            <li className="component project-item animationOut" ref="projectItem" onClick={this.openProject.bind(this,this.props.data.key)} style={style}>
                {this.props.data.item.name}
            </li>
        );
        
    }
}

ProjectItem.animationState = {
    IN : 1,
    OUT : 2
};