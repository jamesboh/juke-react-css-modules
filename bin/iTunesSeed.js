#!/usr/bin/env node

'use strict'

const itunes = require('itunes-library-stream')
const userhome = require('userhome')
const status = require('node-status')
const path = require('path')
const fs = require('fs')

const db = require('../server/db/db')
require('../server/db/models') // Init the relations
const log = require('./log')

const Promise = db.Promise
const KEY = Symbol('key')
const TRACKS = Symbol('TRACKS')
const DEFAULT_TRACK_LIMIT = 500

const program = require('commander')

program
  .usage('[options] [iTunes Music Library.xml...]')
  .description("Seeds the juke database with metadata from an XML iTunes library file. " +
               "By default, we'll import Juke's music.xml and your iTunes library.")
  .option('-f, --force', 'Force sync (will delete everything in the db)')
  .option('-n, --no-itunes', 'Skip importing iTunes library')
  .option('-L, --limit <num>', `Limit total tracks imported to <num> (default ${DEFAULT_TRACK_LIMIT})`, parseInt)
  .option('-u, --unlimited', 'Import unlimited tracks')

function checkItunes () {
  return new Promise((resolve, reject) => {
    try {
      const xmlPath = path.resolve(userhome(), 'Music/iTunes/iTunes Music Library.xml')
      fs.stat(xmlPath, (err, stats) => {
        resolve(!err && stats.isFile() && xmlPath)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function main() {
  program.parse(process.argv)

  status[TRACKS] = {
    total: status.addItem('total', {color: 'magenta'}),
    skipped: status.addItem('skipped', {color: 'yellow'}),
    seeding: status.addItem('seeding', {color: 'green'}),
    seeded: status.addItem('seeded', {color: 'blue'})
  }
  status.start({ label: 'XML tracks', invert: false, interval: 125 })

  program[TRACKS] = program.unlimited ? Infinity : program.limit || DEFAULT_TRACK_LIMIT;

  Promise.all([db.sync({ force: program.force }), checkItunes()])
    .spread((tablesAreReady, xmlPath) => {
      const imported = program.args.concat(
        path.resolve(__dirname, '..', 'music.xml'),
        program.itunes && xmlPath
      ).map(importLibrary)
      return Promise.all(imported)
    })
    .finally(allDone => {
      status.stop()
      db.close() // else Sequelize keeps open ~10 secs, anticipating queries
      return null // silence Bluebird re: promise made in but not returned from db.close
    })
}

process.on('exit', bye =>
           console.log(
             [Artist, Album, Song, ArtistSong].map(
               model =>
                 `${model.table}: ${model.found} found, ` +
                 `${model.created} created, ` +
                 `${model.errors} errors`)
               .join('\n')
           ))

// importLibrary(iTunesXml: String)
//
// Imports the song data from the iTunes Music Library.xml file.
function importLibrary(iTunesXml) {
  if (!iTunesXml) return;

  const tracks = []

  return new Promise(resolve => {

    const xmlStream = fs.createReadStream(iTunesXml)
    .on('error', err => console.error(err))

    xmlStream.pipe(itunes.createTrackStream())
    .on('data', function(data) {

      status[TRACKS].total.inc(1)

      // Filter out...
      if (
        (status[TRACKS].seeding.count >= program[TRACKS]) || // would be better to end stream, but `sax` does not handle .end correctly.
        !data.Location ||           // Songs from iCloud and TV shows and such, which won't have locations
        !data.Name ||               // Entries which don't have names for some reason?
        !data.Artist ||
        !data.Album ||
        (data.Kind && data.Kind.indexOf('audio') === -1) || // non-songs
        (data.Kind && data.Kind.indexOf('Apple Lossless') !== -1) || // ALAC files
        (data.Kind && data.Kind.indexOf('app') !== -1) // Apps
      ) {
        status[TRACKS].skipped.inc(1)
        return
      }

      status[TRACKS].seeding.inc(1)

      const seeding = ArtistSong({
        artistId: Artist({name: data.Artist || data['Album Artist'] || 'Unknown artist'}),
        songId: Song({
          name: data.Name,
          url: data.Location,
          genre: data.Genre,
          albumId: Album({
            name: data.Album,
            artistId: Artist({name: data['Album Artist'] || data.Artist || 'Unknown artist'})
          }),
        })
      })

      tracks.push(seeding)
      seeding.then(() => status[TRACKS].seeded.inc(1))

    })
    .on('end', function () {
      resolve(Promise.all(tracks))
    })

  })
}

// [Artist, Album, Song, ArtistSong]: [...findOrCreate<table: String>]
const Results = ['artists', 'albums', 'songs', 'artistSong']
      .map(table => {
          // findOrCreate<table: String>(columns: { ...[key]: value }) ~> id: Integer
          //
          // Finds or creates a column with the specified values for the given columns
          // and resolves with the integer id value.
          function findOrCreate(columnValues) {
             const key = keyFor(columnValues)
             if (findOrCreate[key]) {
               log.debug `cache hit for ${key}, with inner key ${findOrCreate[key][KEY]}`
               return findOrCreate[key]
             }
             const pKeyExpr = (findOrCreate.primaryKey || ['id']).map(k => `"${k}"`).join(',')
             var keys, values
             let self = findOrCreate[key] = Promise
                 .props(columnValues)
                 .then(cols => {
                   keys = Object.keys(cols)
                   values = keys.map(k => cols[k])
                   return cols
                 })
                 .then(row => db.query(`SELECT ${pKeyExpr} from "${table}"
                                       WHERE ${keys.map(col => `"${col}"=?`).join(' AND ')}`, {
                                         replacements: values,
                                         type: 'SELECT'
                                       }))
                 .then(results => results.length? (++findOrCreate.found, results) :
                        db.query(`INSERT INTO "${table}"
                               (${keys.map(c => `"${c}"`).join(', ')}, "createdAt", "updatedAt")
                                 VALUES (${keys.map(v => '?')}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                                 RETURNING ${pKeyExpr}`, {
                                   replacements: values,
                                   type: 'INSERT'
                                 }))
                 .then(results => (++findOrCreate.created, results[0].id))
                 .catch(err => {
                   log.error `warning: ${err.message}`
                   log.error `  in findOrCreate for ${key} into ${table}`
                   ++findOrCreate.errors
                   return null
                 })

             self[KEY] = key
             log.debug `added key ${self[KEY]}`

             findOrCreate[key] = self
             return self
           }

        findOrCreate.found = 0
        findOrCreate.created = 0
        findOrCreate.errors = 0
        findOrCreate.table = table
        return findOrCreate
      })
const Artist = Results[0], 
      Album = Results[1], 
      Song = Results[2], 
      ArtistSong = Results[3]

// Sequelize uses a column pair as the primary key of its join table, so we'd better select
// that and not id.
ArtistSong.primaryKey = ['artistId', 'songId']

// keyFor(obj: Object) -> String
//
// Returns a string key identifying the object. The generated key is a lot like
// the JSON serialization of object, except that any child objects with a [KEY] property will
// use that [KEY] as their serialization. (This lets us generate appropriate keys for Promises).
function keyFor(obj) {
  return obj && obj[KEY] ||
    obj && typeof obj === 'object' && `{${Object.keys(obj).map(k => `${k}:${keyFor(obj[k])}`)}}` ||
    obj + ''
}

require.main === module && main()
