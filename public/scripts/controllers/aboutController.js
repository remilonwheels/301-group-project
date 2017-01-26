'use strict';

(function(module) {
  const aboutController = {};

  aboutController.index = () => {
    $('section').hide();
    $('#about-us').show();
  };

  module.aboutController = aboutController;
})(window);
