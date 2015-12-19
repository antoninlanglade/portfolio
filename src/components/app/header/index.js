import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, routerComponent, Asset, assets, router} from 'dan';
import config from 'config';
import './styles.scss';
import Projects from 'components/app/projects';
import {AnimationComponent} from 'tools/animation';

@i18nComponent
@routerComponent
@AnimationComponent
export default class Header extends React.Component {
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
            <div className="component header">
                <div className="title">
                    <Link route="home"><h1>Antonin Langlade</h1></Link>
                    <Link route="home"><div className="developer"><Localize>interactive-dev</Localize></div></Link>
                </div>
                <Projects /> 
                <div className="locale">
                    {
                        config.locales.map((locale) => {
                            return <Link {...params} route={router.route} locale={locale} className={"lang "+(i18n.locale === locale?"current":"")} key={locale}>{locale}</Link>
                        })
                    }
                </div>
            </div>
        );
    }
}