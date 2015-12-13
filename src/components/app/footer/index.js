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
                <Link route="about"><Localize>about</Localize></Link>
                <Link href="https://twitter.com/antoninlanglade" target="blank">Twitter</Link>
                <Link href="https://github.com/antoninlanglade" target="blank">Github</Link>
            </div>
        );
    }
}