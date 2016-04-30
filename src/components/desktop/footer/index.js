import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets, router, routerComponent} from 'dan';
import config from 'config';
import './styles.scss';
import {AnimationComponent} from 'tools/animation';

@i18nComponent
@routerComponent
@AnimationComponent
export default class Footer extends React.Component {
    constructor(props) {
        super(props);

    }

    changeLocale(locale, e) {
        e.preventDefault();
        i18n.locale = locale;
    }

    render() {
        var params = router.ctx && router.ctx.params?router.ctx.params:{};
        return (
            <div className="component footer">
                <Link route="about"><Localize>about</Localize></Link>
                <Link href="https://twitter.com/antoninlanglade" target="blank">Twitter</Link>
                <Link href="https://github.com/antoninlanglade" target="blank">Github</Link>
                <div className="locale">
                    {
                        config.locales.map((locale, index) => {
                            return <span className="itemLocal">
                                {index > 0 ? <span className="separator">/</span> : null}
                                <Link {...params} route={router.route} locale={locale} className={"lang "+(i18n.locale === locale?"current":"")} key={locale}>{locale}</Link>
                            </span>
                        })
                    }
                </div>
            </div>
        );
    }
}