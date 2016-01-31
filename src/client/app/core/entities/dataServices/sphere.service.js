(function () {
  'use strict';

  angular
    .module('app.core.entities')
    .factory('SpheresFactory', SpheresFactory);

  SpheresFactory.$inject = ['$resource'];
  /* @ngInject */
  function SpheresFactory(resourceService) {
    var URL = '/api/spheres/:id';
    var ID = '@_id';

    var service = resourceService(URL, {
      id: ID
    }, {
      update: {method: 'PUT'}
    });

    return service;
  }
})();
