import React from 'react';

export default class Share extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    componentWillReceiveProps(props) {
        this.setState(props);
    }

    get defaultUrl() {
        return "";
    }

    get url() {
        var params = this.state || {};
        var url = this.shareUrl;
        _.each(params, function(value, key) {
            if(_.isString(value)) {
                url = url.replace('{'+key+'}', encodeURIComponent(value.replace('"', "%2522")));
            }
        }, this);
        return url.replace(/&?[^&?]*=\{[^{}]*\}/g, "");
    }

    onClick(event) {
        event.preventDefault();

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

    render() {
        return (
            <a href={this.url} onClick={this.onClick.bind(this)}>{this.props.children}</a>
        );
    }
}