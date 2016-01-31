(function () {
  'use strict';

  angular
    .module('app.core.entities')
    .factory('baseEntity', baseEntity);

  baseEntity.$inject = [];
  /* @ngInject */
  function baseEntity() {

    function Base() {
      this.id = ++Base.numberOfEntities;
    }

    Base.numberOfEntities = 0;

    return Base;
  }
})();
