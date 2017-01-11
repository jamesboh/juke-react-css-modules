'use strict';

const express = require('express');
const router = new express.Router();
const models = require('../../db/models');
const Artist = models.Artist;
module.exports = router;

router.get('/', function (req, res, next) {
  Artist.findAll({ where: req.query })
  .then(artists => res.json(artists))
  .catch(next);
});

router.param('artistId', function (req, res, next, id) {
  Artist.findById(id)
  .then(artist => {
    if (!artist) {
      const err = Error('Artist not found');
      err.status = 404;
      throw err
    }
    req.artist = artist;
    next();
    return null; // silences bluebird warning about promises inside of next
  })
  .catch(next);
});

router.get('/:artistId', function (req, res) {
  res.json(req.artist);
});

router.get('/:artistId/albums', function (req, res, next) {
  req.artist.getAlbums() // instance method, check it out in the model
  .then(albums => res.json(albums))
  .catch(next);
});

router.get('/:artistId/songs', function (req, res, next) {
  req.artist.getSongs({
    include: [Artist]
  })
  .then(songs => res.json(songs))
  .catch(next);
});
