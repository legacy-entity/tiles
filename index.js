
var v = require('vector')

/**
 * tiles
 */

module.exports = function (el, url, mapSize, tileSize, map) {

  var tiles = {}

  tiles.map = []

  tiles.init = function () {
    var width = mapSize.width
    var height = mapSize.height

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        tiles.map.push(v(x,y))
      }
    }

    map.forEach(function (row) {
      row.forEach(function (pos) {
        tiles.addTile(tiles.map[pos])
      })
    })
  }

  tiles.addTile = function (pos) {
    var div = document.createElement('div')
    div.style.background = 'url('+url+') -'
      +(pos.x*tileSize.width)+'px -'
      +(pos.y*tileSize.height)+'px no-repeat'
    div.classList.add('tile')
    el.appendChild(div)
  }

  return tiles

}