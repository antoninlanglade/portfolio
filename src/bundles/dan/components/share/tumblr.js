import Share from './';

export default class Tumblr extends Share {
    get shareUrl() {
        return window.location.protocol + "//www.tumblr.com/share/link?url={url}&name={title}&description={description}";
    }
}