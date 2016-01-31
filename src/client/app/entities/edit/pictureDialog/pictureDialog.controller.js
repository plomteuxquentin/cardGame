(function () {
  'use strict';

  angular
    .module('app.members.edit')
    .controller('MembersPictureDialogController', MembersPictureDialogController);

  MembersPictureDialogController.$inject = ['picture','$mdDialog'];
  /* @ngInject */
  function MembersPictureDialogController(picture, dialogService) {
    var self = this;
    self.picture = picture;
    self.croppedPicture = '';

    self.cancel = cancel;
    self.erase = erase;
    self.validate = validate;

    activate();

    function activate() {
      console.log(picture);
    }

    function cancel () {
      dialogService.cancel();
    }

    function erase () {
      dialogService.hide({
        croppedPicture:null,
        originalPicture:null
      });
    }

    function validate () {
      dialogService.hide({
        croppedPicture:self.croppedPicture,
        originalPicture:self.picture
      });
    }
  }
})();
