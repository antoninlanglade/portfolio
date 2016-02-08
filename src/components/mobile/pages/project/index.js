import React from 'react';
import ReactDOM from 'react-dom';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import {AnimationComponent} from 'tools/animation';
import './styles.scss';
import 'gsap';


@i18nComponent
@AnimationComponent
export default class Description extends React.Component {
    constructor(props) {
        super(props);
        this.data = {};
        this.dom = {};
        this.sync();
        this.loop = true;
        this.currentImage = 0;
    }

    sync() {
        this.data = _.find(i18n.localize('data', null, 'data'), (project) => {
            return project.route === this.props.index;
        });
    }

    componentDidMount() {
        this.dom.el = ReactDOM.findDOMNode(this);
        
    }

    componentDidAppear() {
        
    }

    
    componentWillUnAppear() {

    }

    render() {
        var context,
            persons,
            listPersons,
            role;
        if (this.data) {
            listPersons = this.data.content.persons.map((item, key) => {
                return (
                    <Link className="person" href={item.url} target="_blank" key={key}>{item.name}</Link>
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
        }

        return (
            <div className="component description">
                <div className="top-banner">
                    <Link href={this.data.content.url} target="_blank" ref="url2" className="url"><Localize>visit website</Localize></Link>
                    <Link route="home"><img src={config.path+'img/close.png'} alt="close"/></Link>
                </div>
                <div className="left-block" ref="leftBlock" style={{backgroundColor:this.data.lightColor}}>
                    <div className="imageDescription" ref="imageDescription" style={{backgroundImage: 'url('+config.path+this.data.content.images[this.currentImage]+')'}} ></div>
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
                    
                </div>
            </div>
        );
    }
}