# DAN Frameworks

## Fonts

### Api

[https://github.com/typekit/webfontloader](https://github.com/typekit/webfontloader)

### Setup

In ```/src/main.js``` Add :

```javascript
import Webfont from 'webfont';

setup.push(function(next) {
    Webfont.load({
        google: {
            families: ['Droid Sans', 'Droid Serif']
        },
        active: next,
        inactive: setupError
    });
});
```

### CSS

* In ```/src/components/app/styles.css``` add your customs fonts.
* In ```/src/configs/styles.css``` add your fonts mixins.