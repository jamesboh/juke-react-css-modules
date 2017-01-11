const express = require('express');
const router = new express.Router();
const request = require('request-promise');
const parser = require('xml2json');
module.exports = router;

const lyricsAPIPrefix = 'http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect';

router.get('/:artist/:song', (req, res, next) => {
  request.get(`${lyricsAPIPrefix}?artist=${req.params.artist}&song=${req.params.song}`)
    .then(body => {
      const lyric = parser.toJson(body, {object: true}).GetLyricResult.Lyric;
      res.send({lyric});
    })
    .catch(next);
});
