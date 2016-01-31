(function() {
  'use strict';

  angular
    .module('app.members.details', ['app.core', 'app.widgets'])
    .run(appRun);

  appRun.$inject = ['routerHelper'];

  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'members.details',
        config: {
          url: '/details/:id',
          templateUrl: '..//details/members.details.html',
          controller: 'MembersDetailsController',
          controllerAs: 'vm',
          title: 'members details'
        }
      }
    ];
  }
})();
