'use strict';

page('/', mapController.index);

page('/about', aboutController.index);

page('/rate/:rateTime', mapController.rate );

page();
