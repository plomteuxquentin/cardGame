(function () {
  'use strict';

  angular
    .module('app.core.entities')
    .factory('capacityEntity', capacityEntity);

  capacityEntity.$inject = ['baseEntity'];

  /* @ngInject */
  function capacityEntity(Base) {
    Capacity.BASE_COST = 5;

    function Capacity(name, sphere, description, effectFunction) {
      Base.call(this);

      this.name = name;
      this.sphere = sphere;
      this.description = description;
      this.cout = Capacity.BASE_COST;
      this.effectFunction = (effectFunction || function() { console.warn('Pas d\'effet');});

      console.log('Capacity ' + this.name + ' created');
    }

    Capacity.prototype = Object.create(Base.prototype);
    Capacity.prototype.constructor = Capacity;

    return Capacity;
  }
})();
