import {router, ensure} from 'dan';
import _ from '_';
import Data from 'components/app/projectsData.json';
router.add('home', 'home');

var projects = {};
_.forEach(Data, (item, key) => {
	projects[item.route] = key;
});

router.add('/:projectId', function(scope) {
	ensure('project').then(function(Component) {
		if (router.app.currentPage.state.params.index !== projects[scope.params.projectId]) {
			router.app.setPage(Component, {
				index: projects[scope.params.projectId]
			});
		}
	});
});

export default router;
