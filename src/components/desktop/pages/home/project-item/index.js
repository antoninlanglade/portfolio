import React from 'react';
import ReactDOM from 'react-dom';
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
    }

    componentDidMount() {
        this.dom.el = ReactDOM.findDOMNode(this.refs.projectItem);
    }

    componentWillUnmount() {
        
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
        this.props.animationOut && this.props.animationOut(() => {
            router.goto(router.getRoute('project', {projectId : this.props.data.item.route}));
        });
    }

    overIn() {
        this.props.moveToBackground && this.props.moveToBackground();
        this.dom.el.style.zIndex = 3;
    }

    overOut() {
        this.dom.el.style.zIndex = 2;
    }

    render() {
        var style = {
            right : 100/3*2 - (this.props.data.key * (100/3))+"%",
            backgroundImage : 'url('+(config.path+this.props.data.item.content.images[0])+')',
            backgroundRepeat : 'none',
            backgroundSize : 'cover',
            backgroundPosition : 'center top',
            backgroundColor : this.props.data.item.lightColor
        };

        return (
            <li className="component project-item animationOut" ref="projectItem" onMouseOver={this.overIn.bind(this)} onMouseLeave={this.overOut.bind(this)} onClick={this.openProject.bind(this,this.props.data.key)} style={style}>
                <span className="title">{this.props.data.item.name}</span>
            </li>
        ); 
    }
}

ProjectItem.animationState = {
    IN : 1,
    OUT : 2
};