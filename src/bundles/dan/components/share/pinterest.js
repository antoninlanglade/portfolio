import Share from './';

export default class Pinterest extends Share {
    get shareUrl() {
        return window.location.protocol + "//pinterest.com/pin/create/button/?url={url}&media={picture}&description={description}";
    }
}