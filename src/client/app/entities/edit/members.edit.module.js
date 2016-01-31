(function() {
  'use strict';

  angular
    .module('app.members.edit', ['app.core', 'app.widgets'])
    .run(appRun);

  appRun.$inject = ['routerHelper'];

  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'members.edit',
        config: {
          url: ':id/edit',
          templateUrl: '..//edit/members.edit.html',
          controller: 'MembersEditController',
          controllerAs: 'vm',
          title: 'members edition'
        }
      }
    ];
  }
})();
