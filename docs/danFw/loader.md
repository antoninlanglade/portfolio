# DAN Frameworks

## Loader

### JS

#### Type Image || Audio || Video || JSON

```javascript
import {assets} from 'dan';

assets.add(URL).then((item) => {});
assets.add([ArrayOfURLS]).then((items) => {});
assets.add(URL,name).then((item) => {});
assets.add(URL,name,GROUP).then((item) => {});
```

#### Type Function

```javascript
 assets.add( () => {
     return new Promise(function(resolve, reject) {
         $.ajax({
             url: "URL", 
             success: function(content) {
                 resolve(content);
             },
             error : function(reason) {
                 reject(reason);
             }
         }
         });
     });
 });
```

### REACT View
```javascript
import {Asset} from 'dan';

<Asset className="Image" src="URL" name="String" alt="String" height="100" width="100" onClick={ function }/>
<Asset className="Video" src="URL" name="String" height="1000" width="1000"/>
<Asset className="Audio" src="URL" name="String"/>        
```


