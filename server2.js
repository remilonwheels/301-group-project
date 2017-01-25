const pg = require('pg');
const express = require('express');
// const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000;
const app = express();
const conString = process.env.DATABASE_URL || 'postgres://localhost:5432';
const request = require('request');

app.use(express.static('./public'));

app.get('/', (request, response) => response.sendFile('index.html', {root: './public'}));

let fetch = (req, resp) => {
  request('https://data.seattle.gov/api/views/3neb-8edu/rows.json', (error, response, body) => {
    resp.send(body);
  });
}
app.get('/fetch', fetch);



app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
