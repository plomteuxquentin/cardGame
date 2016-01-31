(function () {
  'use strict';

  angular
    .module('app.core.entities')
    .factory('cardEntity', cardEntity);

  cardEntity.$inject = ['baseEntity', 'capacityEntity'];

  /* @ngInject */
  function cardEntity(Base, Capacity) {

    Card.ATTRIBUT_COST = 5;
    Card.ATTRIBUT_MIN = {attaque: 0, defense: 1};

    function Card(name, description, image, attributs, capacites, spheres, avatar) {
      Base.call(this);

      this.name = (name || null);
      this.description = (description || 'Description de la créature');
      this.image = (image || null);
      this.attributs = (attributs || angular.copy(Card.ATTRIBUT_MIN));
      this.capacites = (capacites || []);
      this.spheres = (spheres || []);
      this.avatar = avatar;

      console.log('Card ' + this.name + ' created');
    }

    Card.prototype = Object.create(Base.prototype);
    Card.prototype.constructor = Card;

    Card.prototype.cost = function() {
      var i;
      var cost = 0;
      var sphereCount = 0;

      for (i = 0; i < this.attributs.defense; i++) {
        cost += Card.ATTRIBUT_COST * i;
      }

      for (i = 0; i < this.attributs.attaque; i++) {
        cost += Card.ATTRIBUT_COST * (i + 1);
      }

      for (i = 0; i < this.capacites.length; i++) {
        cost += Capacity.BASE_COST * (i + 1);
      }

      // TODDO refaire
      for (i = 0; i < this.spheres.length; i++) {
        if (this.spheres[i].name === 'Neutral') {
          continue;
        }
        sphereCount++;
      }

      for (i = sphereCount; i > 0; i--) {
        cost += Capacity.BASE_COST * i;
      }

      return cost;
    };

    return Card;
  }
})();
