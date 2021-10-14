/* eslint-env browser */
/* globals $ */

// The size of a swatch (in pixels)
const SWATCH_SIZE = 25

// Utility function - checks if a given swatch name is walkable terrain.
const isTerrain = swatchType => [
  'grass',
  'flowers-red',
  'flowers-orange',
  'flowers-blue',
  'weed',
  'weed-4x',
  'weed-small',
  'weed-2x',
  'field',
  'sand-patch',
  'sand',
  'sand-nw',
  'sand-n',
  'sand-ne',
  'sand-w',
  'sand-e',
  'sand-sw',
  'sand-s',
  'sand-se',
  'sand-nw-inverse',
  'sand-ne-inverse',
  'sand-sw-inverse',
  'sand-se-inverse',
].indexOf(swatchType) >= 0

/**
 * Constructor for the player (Pikachu sprite).
 *
 * @param {number}     x       The beginning x coordinate (usually zero)
 * @param {number}     y       The beginning y coordinate (usually zero)
 * @param {MapBuilder} builder The MapBuilder object, with information about the map.
 *                             In particular, this builder object should have the container
 *                             element as a property so the '.map' div can be found using a
 *                             jQuery 'find' call.
 */
class Player {
  constructor(x, y, builder) {
    this.builder = builder
    this.$map = builder.$elem.find('.map')

    /**
     * TODO: Initialize the player class. You'll need to
     * 1. Create an element for the player and add it to the DOM, with a class
     *    specifying orientation. The classes are 'facing-{up, down, left, right}.'
     * 2. Listen to *keydown* events *on the document* to move the player.
     *    Keycodes for [left, up, right, down] are [37, 38, 39, 40], respectively.
     * 3. Change the player position and orientation based on key presses.
     *
     * You are highly encouraged to implement helper methods. See the class
     * website for more details.
     */
    const $player = $('<div>')
    $player.addClass('player facing-down')
    $player.css({
      top: `${y * SWATCH_SIZE}px`,
      left: `${x * SWATCH_SIZE}px`,
    })

    this.$map.append($player)

    const $doc = $(document)

    $doc.on('keydown', e => {
      this.setOrientation(x, y, $player, e);
      // eslint-disable-next-line no-param-reassign
      [x, y] = this.isValidMove(x, y, $player, e, this.$map)
      // If the coords were valid, the new coords should be different
      $player.css({
        top: `${y * SWATCH_SIZE}px`,
        left: `${x * SWATCH_SIZE}px`,
      })
    })
  }

  setOrientation = (x, y, $player, e) => {
    const nodeList = $player.get(0).classList
    $player.removeClass(nodeList[1])
    if (e.which === 37) {
      $player.addClass('facing-left')
    } else if (e.which === 38) {
      $player.addClass('facing-up')
    } else if (e.which === 39) {
      $player.addClass('facing-right')
    } else if (e.which === 40) {
      $player.addClass('facing-down')
    }
  }

  isValidMove = (x, y, $player, e, $map) => {
    let finalX = x
    let finalY = y
    if (e.which === 37) {
      // cannot move left is at the left edge
      if (x > 0) {
        // For desired position (x-1,y)
        const $currPos = $map.find($('.row')).eq(y)
        // the spot to the left (the adjacent spot to which it is facing)
        const $nodeList = $currPos
          .find($('.swatch'))
          .eq(x - 1)
          .get(0).classList
        // console.log('list:', $nodeList)
        // If there exists an added swatch, this is defined as obj (third)
        // If no added swatch, we just use noSwatch (second element)
        const $obj = $nodeList[3]
        const $noSwatch = $nodeList[2]
        // check if the desired position to move to holds a swatch
        // and if it is a walkable terrain (using isTerrain)
        // else, it is not a swatch and we still want to check if it is
        // walkable terrain
        if (($obj && isTerrain($obj)) || (!$obj && isTerrain($noSwatch))) {
          finalX -= 1
        }
      }
    } else if (e.which === 38) {
      // cannot move up if at the top edge
      if (y > 0) {
        // For desired position (x,y-1)
        const $currPos = $map.find($('.row')).eq(y - 1)
        const $nodeList = $currPos.find($('.swatch')).eq(x).get(0).classList
        const $obj = $nodeList[3]
        const $noSwatch = $nodeList[2]
        if (($obj && isTerrain($obj)) || (!$obj && isTerrain($noSwatch))) {
          finalY -= 1
        }
      }
    } else if (e.which === 39) {
      // Cannot move right if at the right edge
      if (x <= this.builder.width - 2) {
        // For desired position (x+1,y)
        const $currPos = $map.find($('.row')).eq(y)
        const $nodeList = $currPos
          .find($('.swatch'))
          .eq(x + 1)
          .get(0).classList
        const $obj = $nodeList[3]
        const $noSwatch = $nodeList[2]
        if (($obj && isTerrain($obj)) || (!$obj && isTerrain($noSwatch))) {
          finalX += 1
        }
      }
    } else if (e.which === 40) {
      // Cannot move down if at the botom edge
      if (y <= this.builder.height - 2) {
        // For desired position (x,y+1)
        const $currPos = $map.find($('.row')).eq(y + 1)
        const $nodeList = $currPos.find($('.swatch')).eq(x).get(0).classList
        const $obj = $nodeList[3]
        const $noSwatch = $nodeList[2]
        if (($obj && isTerrain($obj)) || (!$obj && isTerrain($noSwatch))) {
          finalY += 1
        }
      }
    }
    // Need some way to keep track of the updated coordinates
    return [finalX, finalY]
  }
}
