'use strict';

const express = require('express');
const router = new express.Router();
const models = require('../../db/models');
const Playlist = models.Playlist;
module.exports = router;

router.get('/', function (req, res, next) {
  Playlist.findAll({ where: req.query })
  .then(playlists => res.json(playlists))
  .catch(next);
});

router.post('/', function (req, res, next) {
  Playlist.create(req.body)
  .then(playlist => res.status(201).json(playlist))
  .catch(next);
});

router.param('playlistId', function (req, res, next, id) {
  Playlist.scope('populated').findById(id)
  .then(playlist => {
    if (!playlist) {
      const err = Error('Playlist not found');
      err.status = 404;
      throw err
    }
    req.playlist = playlist;
    next();
    return null; // silences bluebird warning about promises inside of next
  })
  .catch(next);
});

router.get('/:playlistId', function (req, res) {
  res.json(req.playlist);
});

router.put('/:playlistId', function (req, res, next) {
  req.playlist.update(req.body)
  .then(playlist => res.status(200).json(playlist))
  .catch(next);
});

router.delete('/:playlistId', function (req, res, next) {
  req.playlist.destroy()
  .then(() => res.status(204).end())
  .catch(next);
});

router.get('/:playlistId/songs', (req, res) => res.json(req.playlist.songs));

router.post('/:playlistId/songs', function (req, res, next) {
  const id = req.body.id || req.body.song.id;
  req.playlist.addAndReturnSong(id)
  .then(song => res.status(201).json(song))
  .catch(err => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).send('Song is already in the playlist.');
    } else {
      return next(err);
    }
  });
});

router.get('/:playlistId/songs/:songId', function (req, res) {
  const requestedSong = req.playlist.songs.find(function (song) {
    return song.id === Number(req.params.songId);
  });
  if (!requestedSong) res.sendStatus(404);
  else res.json(requestedSong);
});

router.delete('/:playlistId/songs/:songId', function (req, res, next) {
  req.playlist.removeSong(req.params.songId)
  .then(() => res.sendStatus(204))
  .catch(next);
});
