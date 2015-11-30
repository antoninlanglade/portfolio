# DAN Frameworks

## Share

### React

```javascript
import Facebook from "dan/components/share/facebook";
import Pinterest from "dan/components/share/pinterest";
import Tumblr from "dan/components/share/tumblr";
import Twitter from "dan/components/share/twitter";
import Weibo from "dan/components/share/weibo";
```

```html
<Facebook url="" title="" description="" picture="">...</Facebook>
<Pinterest url="" picture="" description="">...</Pinterest>
<Tumblr url="" title="" description="">...</Tumblr>
<Twitter url="" description="" hastags="">...</Twitter>
<Weibo url="" title="" picture="">...</Weibo>
```

### Facebook

In ```/src/main.js``` Add :

```javascript
import Facebook from 'dan/components/share/facebook';

setup.push(function(next) {
    var locale = 'en_GB'; // Put here your facebook locale
	Facebook.setup(locale).then(function(FB) {
		FB.init({
			appId: 'your-facebook-app-id',
			version: 'v2.3'
		});
		next();
	});
});
```

#### API

```javascript
import {FB} from 'dan/components/share/facebook';
```


