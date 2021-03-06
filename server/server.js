const express = require('express');
const path = require('path');
const morgan = require('morgan');
const expressStaticGzip = require('express-static-gzip');
const db = require('./db/db.js');

const app = express();
const port = process.env.PORT || 3040;
// Potential optimization:
// Instead of serving website that triggers API calls, send data long with it
app.use(morgan('dev'));

app.listen(port, () => { console.log(`Listening on port ${port}`); });

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/', expressStaticGzip(path.join(__dirname, '..', 'client', 'dist'), {
  enableBrotli: true,
  customCompressions: [{
    encodingName: 'deflate',
    fileExtension: 'zz',
  }],
  orderPreference: ['br', 'gz'],
}));

app.get('/restaurants/:id', (req, res) => {
  db.getRestaurant(req.params.id, (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

app.get('/articles/:id', (req, res) => {
  db.getArticles(req.params.id, (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

app.get('/reviews/:id', (req, res) => {
  db.getReviews(req.params.id, (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

// To show restaurant page
app.use('/:id', express.static(path.join(__dirname, '..', 'client', 'dist')));
