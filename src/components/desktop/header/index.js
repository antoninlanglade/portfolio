import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, routerComponent, Asset, assets, router} from 'dan';
import config from 'config';
import './styles.scss';
import Projects from 'desktop/projects';
import {AnimationComponent} from 'tools/animation';

@AnimationComponent
export default class Header extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
    
        return (
            <div className="component header">
                <div className="title">
                    <Link route="home"><h1>Antonin Langlade</h1></Link>
                    <Link route="home"><div className="developer"><Localize>interactive-dev</Localize></div></Link>
                </div>
                <Projects /> 
            </div>
        );
    }
}