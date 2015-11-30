import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';
import Projects from 'components/app/projects';

@i18nComponent
export default class Header extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="component header">
                <div className="title">
                    <h1>Antonin Langlade</h1>
                    <div className="developer">Interactive Developer</div>
                </div>
                <Projects /> 
            </div>
        );
    }
}