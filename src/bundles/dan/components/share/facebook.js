import Share from './';
import $ from 'jQuery';

export default class Facebook extends Share {
    get shareUrl() {
        return window.location.protocol + "//www.facebook.com/share.php?u={url}";
    }

    /**
     * Override click handler
     * @param event
     */
    onClick(event) {
        event.preventDefault();
        Facebook.FB.ui({
            method: 'feed',
            display: 'popup',
            name: this.state.title,
            description: this.state.description,
            link: this.state.url,
            picture: this.state.picture
        });
    }

    /**
     * Setup facebook SDK
     * @param locale (default: fr_FR)
     * @return {Promise}
     */
    static setup(locale) {
        locale = locale || 'fr_FR';
        return new Promise((resolve, reject) => {
            // SDK Ready
            if (window.FB) {
                resolve(window.FB);
            }
            // Download SDK
            else {
                $.getScript('//connect.facebook.net/' + locale + '/sdk.js', function () {
                    resolve(Facebook.FB);
                });
            }
        });
    }

    /**
     * Facebook SDK
     * @returns {Object}
     */
    static get FB() {
        return window.FB;
    }
}

export var FB = Facebook.FB;