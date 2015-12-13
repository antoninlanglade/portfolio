import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';


@i18nComponent
export default class Description extends React.Component {
    constructor(props) {
        super(props);
        this.sync();  
    }

    sync() {
        this.data = _.find(i18n.localize('data', null, 'data'), (project) => {
            return project.route === this.props.index;
        });
    }

    render() {
        var context,
            persons,
            listPersons,
            role;

        listPersons = this.data.content.persons.map((item) => {
            return (
                <Link className="person" href={item.url} target="_blank">{item.name}</Link>
            );
        });

        context = this.data.content.context ? <div className="context key">
            <span className="left-column"><Localize>context</Localize></span>
            <span className="right-column">{this.data.content.context}</span>
        </div> : null;
        persons = this.data.content.persons.length !== 0 ?<div className="with key">
            <span className="left-column"><Localize>with</Localize></span>
            <span className="right-column">{listPersons}</span>
            
        </div> : null;
        role = this.data.content.role ? <div className="role key">
            <span className="left-column"><Localize>role</Localize></span>
            <span className="right-column">{this.data.content.role}</span>
        </div> : null;

        return (
            <div className="component description">
                <div className="left-block" style={{backgroundImage: 'url('+config.path+this.data.content.image+')'}}>
                    <Link href={this.data.content.url} target="_blank" className="url line-hover animationIn"><Localize>visit website</Localize></Link>
                </div>
                <div className="right-block">
                    <h2>{this.data.name}</h2>
                    <div className="keys">
                        {context}
                        {persons}
                        {role}
                    </div>
                    <div className="description">
                        {this.data.content.description}
                    </div>
                    <div className="credits">
                        <Localize>credits</Localize> {this.data.name}
                    </div>
                    <Link href={this.data.content.url} target="_blank" className="url line-hover animationIn"><Localize>visit website</Localize></Link>
                </div>
            </div>
        );
    }
}