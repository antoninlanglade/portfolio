# DAN Frameworks

## Flux

### Api

[https://github.com/goatslacker/alt](https://github.com/goatslacker/alt)

### Templates

[docs/templates/flux](docs/templates/flux)

### Views

Call render each time a store change.

```
import React from 'react';
import {StoresComponent} from 'dan';
import SampleStore from 'stores/sample';
import SampleActions from 'actions/sample';


@StoresComponent([
    SampleStore
])
class SampleFlux extends React.Component {
    constructor(props) {
        super(props);
    }

    add() {
        var id = SampleStore.state.data.length;
        SampleActions.add("#"+id);
    }

    render() {
        return (
            <div className="component sampleFlux">
                <div onClick={this.add.bind(this)}>Add</div>
                <ul>
                    {SampleStore.state.data.map(function(todo) {
                        return todo;
                    })}
                </ul>
            </div>
        );
    }
}
```

For filter the render call, add ```shouldStoreUpdate``` method.

```javascript
class SampleFlux extends React.Component {
    shouldStoreUpdate(store) {
        return true;
    }
}
```