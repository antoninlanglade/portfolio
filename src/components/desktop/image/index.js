import React from 'react';
import ReactDOM from 'react-dom';
import _ from '_';
import {Localize, Link, i18n, Asset, assets, StoresComponent} from 'dan';
import config from 'config';
import './styles.scss';
import Background from 'tools/background';
import Size from 'math/size';


class Image extends React.Component {
    constructor(props) {
        super(props);
        this.DOM = {};
        this.onResize = this.onResize.bind(this);
        this.scale = props.scale || 1;
        this.type = this.props.type === void(0) ? Image.BACKGROUND.COVER : this.props.type;
    }

    componentDidMount() {
        window.addEventListener('resize',this.onResize);
        assets.getAssetFromName(this.props.imageName).promise.then(() => {
            this.DOM.el = ReactDOM.findDOMNode(this);
            this.DOM.img = ReactDOM.findDOMNode(this.refs.img);
            this.onResize();
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize',this.onResize);
    }

    onResize() {
        var cover, contain, rectEL;
        if (this.DOM.img) {
            var rectEL = this.DOM.el.getBoundingClientRect();
            var imgSize = new Size(this.DOM.img.naturalWidth, this.DOM.img.naturalHeight);
            var elSize = new Size(rectEL.width, rectEL.height);
            if (this.type === Image.BACKGROUND.COVER) {
                cover = Background.cover(imgSize.width, imgSize.height, elSize.width, elSize.height, this.scale);
                this.applyToHTML(this.DOM.img, cover);
            }
            else if (this.type === Image.BACKGROUND.CONTAIN) {
                contain = Background.contain(imgSize.width, imgSize.height, elSize.width, elSize.height);
                this.applyToHTML(this.DOM.img, contain);
            }
        }
    }

    applyToHTML(el, rect) {
        el.style.width = rect.width+'px';
        el.style.height = rect.height+'px';
        el.style.top = rect.y+'px';
        el.style.left = rect.x+'px';
    }

    render() {
        return (
            <div className={"component image "+(this.props.className?this.props.className:"")} style={this.props.style} data-velocity={this.props.dataVelocity} onClick={this.props.onClick}>
                <Asset name={this.props.imageName} ref="img" data-velocity={this.props.internParallax}/>
            </div>
        );
    }
}

Image.BACKGROUND = {
    CONTAIN : 0,
    COVER : 1
};

export default Image;