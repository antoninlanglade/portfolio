import Share from './';

export default class Twitter extends Share {
    get shareUrl() {
        return window.location.protocol + "//twitter.com/share?text={description}&url={url}&hashtags={hashtags}";
    }
}