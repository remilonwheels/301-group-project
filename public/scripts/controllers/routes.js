'use strict';

page('/', mapController.index);

page('/about', aboutController.index);

page('/*', () => { page('/'); });

page();
