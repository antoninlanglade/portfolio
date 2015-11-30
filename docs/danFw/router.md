# DAN Frameworks

## Router

Based on [Page.js](https://visionmedia.github.io/page.js/)

### json

Routes are localized in a JSON stored at ```./locales/{locale}/routes.json```

The syntax is `"controllerName": "routePath"`

```json
{
  "home": "/",
  "withParams": "/sample/:param1/:optionalParam2?",
  "withSplat": "/sample2/:param(*)"
}

```

### API

```javascript
import {router} from "dan";

router.add(route, controller);
router.goto(href, [target]);
router.getRoute(name, [params], [locale]);

router.use(middleware);
router.start();
router.sync([locale]);
router.hasLocale(locale);
```


#### JS sample
```javascript
import {router} from "dan";

router.add('home', 'home'); // Show Home (for key 'home': see modules.md) component when route is equal to "/"
router.add('withParams', function(ctx) {
    console.log(ctx.params.param1); // param1
});

router.goto(router.getRoute('home')); // Goto "/"
```


### React

```javascript
import {Link} from "dan";
```

```html
<Link route="home">...</Link>
<Link route="shop" item="1">...</Link>
<Link route="shop" locale="fr">...</Link>
<Link href="http://danparis.fr">...</Link>
```

#### routerComponent

Call render each time router change.

```javascript
import {routerComponent} from "dan";

@routerComponent
export default class Home extends React.Component {

}
```
