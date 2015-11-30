# DAN Frameworks

## logger

### Show/Hide

```javascript
import {logger} from 'dan';

logger.show('[cat]'); // Show [cat] logs
logger.hide('[cat]'); // Hide [cat] logs

logger.show('*'); // Show all logs
logger.hide('*'); // Hide all logs
```

### log

```javascript
logger.log('[cat]', 'param 1', 'param 2', '...');
logger.warn('[cat]', 'param 1', 'param 2', '...');
```

### Console access

```javascript
window.logger
```