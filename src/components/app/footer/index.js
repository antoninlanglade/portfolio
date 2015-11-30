import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';

@i18nComponent
export default class Footer extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="component footer">
                <Link>About</Link>
                <Link>Mail</Link>
                <Link>Twitter</Link>
                <Link>Github</Link>
            </div>
        );
    }
}