import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';
import Data from 'components/app/projectsData.json';

@i18nComponent
export default class Description extends React.Component {
    constructor(props) {
        super(props);
        assets.add(() => {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, 200);
            });
        });
    }

    render() {
        var item = Data[this.props.index], context, persons, listPersons, role;
        listPersons = item.content.persons.map((item) => {
            return (
                <Link className="person" href={item.url} target="_blank">{item.name}</Link>
            );
        });

        context = item.content.context ? <div className="context key">
            <span className="left-column"><Localize>Context</Localize></span>
            <span className="right-column">{item.content.context}</span>
        </div> : null;
        persons = item.content.persons.length !== 0 ?<div className="with key">
            <span className="left-column"><Localize>With</Localize></span>
            <span className="right-column">{listPersons}</span>
            
        </div> : null;
        role = item.content.role ? <div className="role key">
            <span className="left-column"><Localize>Context</Localize></span>
            <span className="right-column">{item.content.role}</span>
        </div> : null;

        return (
            <div className="component description">
                <div className="left-block" style={{backgroundImage: 'url('+config.path+item.content.image+')'}}>
                    <Link href={item.content.url} target="_blank" className="url line-hover animationIn"><Localize>visit website</Localize></Link>
                </div>
                <div className="right-block">
                    <h2>{item.name}</h2>
                    <div className="keys">
                        {context}
                        {persons}
                        {role}
                    </div>
                    <div className="description">
                        {item.content.description}
                    </div>
                    <div className="credits">
                        <Localize>credits</Localize> {item.name}
                    </div>
                    <Link href={item.content.url} target="_blank" className="url line-hover animationIn"><Localize>visit website</Localize></Link>
                </div>
            </div>
        );
    }
}