import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';


@i18nComponent
export default class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="component about">
                <div className="left-block" style={{backgroundImage: 'url('+config.path+'img/about.jpg)'}}></div>
                <div className="right-block">
                    <h2  dangerouslySetInnerHTML={{__html: i18n.localize('about-me')}}></h2>
                    <div className="description">
                        <Localize>short-description</Localize>
                    </div>
                    <div className="keys">
                        <div className="context key">
                            <span className="left-column"><Localize>twitter</Localize></span>
                            <span className="right-column"><Localize>twitter-me</Localize></span>
                        </div>
                        <div className="context key">
                            <span className="left-column"><Localize>email</Localize></span>
                            <span className="right-column"><Localize>email-me</Localize></span>
                        </div>
                        <div className="context key">
                            <span className="left-column"><Localize>phone</Localize></span>
                            <span className="right-column"><Localize>phone-me</Localize></span>
                        </div>
                    </div>
                    <div className="description">
                        <Localize>long-description</Localize>
                    </div>
                </div>
            </div>
        );
    }
}