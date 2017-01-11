'use strict';

const express = require('express');
const mime = require('mime');
const router = express.Router();
const models = require('../../db/models');
const Album = models.Album;
module.exports = router;

router.get('/', function (req, res, next) {
  Album.scope('defaultScope', 'songIds').findAll({ where: req.query })
  .then(albums => res.json(albums))
  .catch(next);
});

router.param('albumId', function (req, res, next, id) {
  Album.scope('defaultScope', 'populated').findById(id)
  .then(function (album) {
    if (!album) {
      const err = Error('Album not found');
      err.status = 404;
      throw err
    }
    req.album = album;
    next();
    return null; // silences bluebird warning about promises inside of next
  })
  .catch(next);
});

router.get('/:albumId', function (req, res) {
  res.json(req.album);
});

router.get('/:albumId/image', function (req, res, next) {
  res.redirect(`/api/songs/${req.album.songs[0].id}/image`)
});

router.get('/:albumId/songs/', function (req, res) {
  res.json(req.album.songs);
});

router.get('/:albumId/songs/:songId', function (req, res) {
  const songToSend = req.album.songs.find(song => {
    return song.id === Number(req.params.songId);
  });
  if (!songToSend) return res.sendStatus(404);
  res.json(songToSend);
});
