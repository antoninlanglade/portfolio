import Share from './';

export default class Weibo extends Share {
    get shareUrl() {
        return "http://service.weibo.com/share/share.php?url={url}&appkey=&title={title}&pic={picture}&ralateUid=";
    }
}