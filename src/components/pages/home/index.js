import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';

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

    render() {
        return (
            <div className="component home">
                
            </div>
        );
    }
}