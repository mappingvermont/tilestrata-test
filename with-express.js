var express = require('express')
var tilestrata = require('tilestrata');
var mapnik = require('tilestrata-mapnik');
var disk = require('tilestrata-disk');
var strata = tilestrata();

var app = express()

strata.layer('a')
                .route('tile.png')
                        .use(mapnik({
                                pathname: 'all_pg.xml',
                                scale: 1,
                                tileSize: 256
                        }))
                        .use(disk.cache({dir: './.tilecache/a'}))

strata.layer('b')
                .route('tile.png')
                        .use(mapnik({
                                pathname: 'all.xml',
                                scale: 1,
                                tileSize: 256
                        }))
                        .use(disk.cache({dir: './.tilecache/b'}))


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(tilestrata.middleware({
    server: strata,
    prefix: '/maps'
}));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(80, function () {
  console.log('Example app listening on port 80!')
})
