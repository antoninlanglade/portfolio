import {router, ensure, i18n} from 'dan';
import _ from '_';

router.add('home', function(scope) {
	router.app.goto('home', scope.params);
});

router.add('about', function(scope) {
	router.app.goto('about', scope.params);
});

router.add('project', function(scope) {
	router.app.goto('project', scope.params);
});

export default router;
