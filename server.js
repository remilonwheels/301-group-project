'use strict';

const pg = require('pg');
const express = require('express');
// const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();
const conString = process.env.DATABASE_URL || 'postgres://localhost:5432';

app.use(express.static('./public'));

app.get('/', (request, response) => response.sendFile('index.html', {root: './public'}));


app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
