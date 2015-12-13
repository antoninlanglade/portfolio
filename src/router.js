import {router, ensure, i18n} from 'dan';
import _ from '_';
router.add('home', 'home');
router.add('about', 'about');

var data = i18n.localize('data', null, 'data', i18n.locale);	
var projects = {};
_.forEach(data, (item, key) => {
	projects[item.route] = key;
});

router.add('project', function(scope) {
	ensure('project').then(function(Component) {
		router.app.setPage(Component, {
			index: scope.params.projectId
		});
	});
});

// i18n.on('change', i18nChange);
// i18nChange();

export default router;
