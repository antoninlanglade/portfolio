import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';
import Data from 'components/app/projectsData';

@i18nComponent
export default class Home extends React.Component {
    constructor(props) {
        super(props);

        assets.add(() => {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, 200);
            });
        });
    }

    onWheel() {

    }
    
    render() {
        var projects = Data.map((item, key) => {
            return (
                <li className="project-item" style={{left : "calc(70px + "+(key * 34)+"%)", background : item.color}}>
                    {item.name}
                </li>
            );
        });
        return (
            <div className="component home" onWheel={this.onWheel.bind(this)}>
                <ul className="project-list">
                    {projects}
                </ul>
            </div>
        );
    }
}