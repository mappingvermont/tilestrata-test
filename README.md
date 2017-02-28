# tilestrata-test

First test of [tilestrata](https://github.com/naturalatlas/tilestrata) to dynamically serve tiles from RGB tifs.

run `sudo node with-express.js` to serve tiles on port 80.

this creates two tile server routes, one based on `all.xml` and one based on `all_pg.xml`.

`all.xml` looks at the `data` directory for VRTs of all zoom levels (1.vrt, 2.vrt, etc)

`all_pg.xml` connects to a PostGIS database on localhost (database test, user ubuntu) and looks for tables z_1, z_2, etc.

To insert these tables into PostGIS, I did:
`raster2pgsql -C -F -I -t auto *_z_9.tif z_9 | psql -U ubuntu test`

Double check that this creates indexes for each raster using the following:
psql -U ubuntu test -c "\d+ z_1" | grep gist

If grep doesn't find anything, create indexes in the psql shell like so:
`CREATE INDEX z_9_rast_gist_idx ON z_9 USING GIST (ST_ConvexHull(rast));`

Loading rasters for z_11 takes an hour, for z_12 takes about 4 hours.

## todo
add new tables as OVERVIEWS for basetable, instead of just z_1, name them o_z12_1 (or something)
that way we can simplify mapnik xml stylesheet
pre-generate levels 0 - 7, or something -- tilemantle
dockerize
read this: https://github.com/mapnik/mapnik/wiki/PgRaster
and be sure to define srid in connection string, will save a query to the database

## other ideas
make a simple by-year raster, where band 1 = year, band 2 = confidence, and band 3 = intensity
then use mapnik to recode these dynamically?

like . . . have a few different endpoints and just use different mapnik XML to render each
	/tiles/glad-yearly/{z}/{x}/{y}/
	/tiles/glad-all/{z}/{x}/{y}/
	/tiles/glad-encoded/{z}/{x}/{y}/
	/tiles/glad-last-month/{z}/{x}/{y}/
	
should definitely be able to create a glad-all raster using GDAL. Just combine date/conf with intensity, and have RGB be pink, + A be the value from intensity. then using node-mapnik to serve that. easy.
