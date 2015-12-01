import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';

@i18nComponent
export default class ProjectItem extends React.Component {
    constructor(props) {
        super(props);
    }

    animationIn() {
        console.log('in');
    }

    animationOut() {
        console.log('out');
    }

    render() {
        
        return (
            <li className="project-item" style={{left : (this.props.data.key * (100/3))+"%", background : this.props.data.item.color}}>
                {this.props.data.item.name}
            </li>
        );
        
    }
}