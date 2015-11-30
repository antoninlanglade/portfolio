import React from 'react';
import _ from '_';

var sharesURL = {
    facebook: window.location.protocol + "//www.facebook.com/share.php?u={url}",
    twitter: window.location.protocol + "//twitter.com/share?text={description}&url={url}&hashtags={hashtags}",
    pinterest: window.location.protocol + "//pinterest.com/pin/create/button/?url={url}&media={picture_url}&description={description}",
    tumblr: window.location.protocol + "//www.tumblr.com/share/link?url={url}&name={title}&description={description}",
    weibo: "http://service.weibo.com/share/share.php?url={url}&appkey=&title={title}&pic={picture_url}&ralateUid=&language=EN"
};

export class Share extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    componentWillReceiveProps(props) {
        this.setState(props);
    }


    onClick(event) {
        event.preventDefault();

        // Facebook
        if (this.state.platform == 'facebook' && FB) {
            FB.ui({
                method: 'feed',
                display: 'popup',
                name: params.title,
                description: params.description,
                link: params.url,
                picture: params.picture_url
            });
        }
        // Others
        else {
            var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2,
                opts = 'status=1' +
                    ',width=' + parseInt(width) +
                    ',height=' + parseInt(height) +
                    ',top=' + parseInt(top) +
                    ',left=' + parseInt(left);

            window.open(this.url, '', opts);
        }
    }

    get url() {
        var params = this.state || {};
        var url = sharesURL[params.platform];
        _.each(params, function(value, key) {
            if(_.isString(value)) {
                url = url.replace('{'+key+'}', encodeURIComponent(value.replace('"', "%2522")));
            }
        }, this);
        return url;
    }

    render() {
        return (
            <a href={this.url} onClick={this.onClick.bind(this)}>{this.props.children}</a>
        );
    }
}