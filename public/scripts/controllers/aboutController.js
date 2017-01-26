'use strict';

(function(module) {
  const aboutController = {};

  aboutController.index = () => {
    $('#about-us').show();
  };

  module.aboutController = aboutController;
})(window);
