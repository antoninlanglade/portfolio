# DAN Frameworks

## Modules

### json

List chunks in ```./src/modules.json```

```json
{
  "myModule": "sample/myModule.js"
}
```

### API

```javascript
import {ensure} from "dan/modules";

ensure("myModule").then((content) => {
    // TODO
});
```

### Sample


```javascript
// sample/myModule.js
export default "Hello world";
```

```javascript
// sample/app.js
import {ensure} from "dan/modules";

ensure("myModule").then((content) => {
    console.log(content); // Hello world
});
```