'use strict';


page('/', mapController.index);

page('/about', aboutController.index);

page('/:rate', mapController.rate );

page('/*', () => { page('/2Hr'); });



page();
