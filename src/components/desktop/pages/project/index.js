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
        this.dom.imageDescription = ReactDOM.findDOMNode(this.refs.imageDescription);
        this.dom.percent = ReactDOM.findDOMNode(this.refs.percent);
        this.dom.url1 = ReactDOM.findDOMNode(this.refs.url1);
        this.dom.url2 = ReactDOM.findDOMNode(this.refs.url2);
    }

    componentDidAppear() {
        this.dom.url1.classList.add('animationIn');
        this.dom.url2.classList.add('animationIn');
        if (this.data.content.images.length > 1) {
            this.percentLoop();    
        }
    }

    percentLoop() {
        if (!this.loop) {
            return;
        }
        TweenMax.to(this.dom.percent, 5, {
            width : '100%',
            delay : 0.5,
            ease : Linear.easeNone,
            onComplete : () => {
                this.currentImage < this.data.content.images.length-1 ? this.currentImage++ : this.currentImage = 0;
                this.dom.imageDescription.classList.remove('scaleDown');
                this.dom.imageDescription.classList.add('scaleUp');
                this.forceUpdate(() => {
                    setTimeout(() => {
                        this.dom.imageDescription.classList.remove('scaleUp');
                        this.dom.imageDescription.classList.add('scaleDown');    
                    },50);
                });
                TweenMax.to(this.dom.percent, .5, {
                    width : '0',
                    left : '100%',
                    ease : Linear.easeNone,
                    onComplete : () => {
                        TweenMax.set(this.dom.percent, {
                            left : "0",
                            width : "0px"
                        });
                        this.percentLoop();
                    }
                });     
            }
        });
    }

    componentWillUnAppear() {
        this.lopp = false;
        this.dom.url1.classList.remove('animationIn');
        this.dom.url2.classList.remove('animationIn');
    }

    render() {
        var context,
            persons,
            listPersons,
            role,
            awards;
        if (this.data) {
            listPersons = this.data.content.persons.map((item, key) => {
                return (
                    <Link className="person" href={item.url} target="_blank" key={key}>{item.name}</Link>
                );
            });

            context = this.data.content.context ? <div className="context key">
                <span className="left-column" style={{color : this.data.blackColor}}><Localize>context</Localize></span>
                <span className="right-column">{this.data.content.context}</span>
            </div> : null;
            persons = this.data.content.persons.length !== 0 ?<div className="with key">
                <span className="left-column" style={{color : this.data.blackColor}}><Localize>with</Localize></span>
                <span className="right-column">{listPersons}</span>
                
            </div> : null;
            role = this.data.content.role ? <div className="role key">
                <span className="left-column" style={{color : this.data.blackColor}}><Localize>role</Localize></span>
                <span className="right-column">{this.data.content.role}</span>
            </div> : null;
            awards = this.data.content.awards ? <div className="awards key">
                <span className="left-column" style={{color : this.data.blackColor}}><Localize>awards</Localize></span>
                <span className="right-column">{this.data.content.awards}</span>
            </div> : null;
        }

        return (
            <div className="component description">
                <div className="close">
                    <Link route="home"><img src={config.path+'img/close.png'} alt="close"/></Link>
                </div>
                <div className="left-block" ref="leftBlock" style={{backgroundColor:this.data.lightColor}}>
                    <div className="imageDescription" ref="imageDescription" style={{backgroundImage: 'url('+config.path+this.data.content.images[this.currentImage]+')'}} />
                    <Link href={this.data.content.url} ref="url1" target="_blank" className={this.data.color+" url line-hover"}><Localize>visit website</Localize></Link>
                    <div className="percent" ref="percent"></div>
                </div>
                <div className="right-block">
                    <h2>{this.data.name}</h2>
                    <div className="keys">
                        {context}
                        {persons}
                        {role}
                        {awards} 
                    </div>
                    <div className="description">
                        {this.data.content.description}
                    </div>
                    <div className="credits">
                        <Localize>credits</Localize> {this.data.name}
                    </div>
                    <Link href={this.data.content.url} target="_blank" ref="url2" className={"url line-hover"}><Localize>visit website</Localize></Link>
                </div>
            </div>
        );
    }
}