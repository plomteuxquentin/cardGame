(function () {
  'use strict';

  angular
    .module('app.core.entities')
    .factory('sphereEntity', sphereEntity);

  sphereEntity.$inject = ['baseEntity'];

  /* @ngInject */
  function sphereEntity(Base) {

    Sphere.BASE_COST = 5;
    Sphere.DEFAULT_COLOR = '#FFFFFF';

    function Sphere(name, description, color) {
      Base.call(this);

      this.name = name;
      this.description = description;
      this.color = (color || Sphere.DEFAULT_COLOR);

      console.log('Sphere ' + this.name + ' created');
    }

    Sphere.prototype = Object.create(Base.prototype);
    Sphere.prototype.constructor = Sphere;

    return Sphere;
  }
})();
