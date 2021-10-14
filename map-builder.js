/* eslint-env browser */
/* globals $ */

// Default size of map (in tiles)
const DEFAULT_WIDTH = 30
const DEFAULT_HEIGHT = 15

// additional fields
let current = 'grass'
let mouseIsDown = false

/**
 * @param {object} $container jQuery node to inject map into
 * @param {{ width?: number, height?: number }} params
 */
class MapBuilder {
  // TODO: Initialize MapBuilder parameters

  width = DEFAULT_WIDTH

  height = DEFAULT_HEIGHT

  constructor($container, params) {
    this.$elem = $container
    if (typeof params === 'undefined') {
      this.width = DEFAULT_WIDTH
      this.height = DEFAULT_HEIGHT
    } else {
      this.width = params.width
      this.height = params.height
    }
  }

  // helper
  extract = $elem => $elem.get(0).classList

  // TODO: Implement MapBuilder.setupPalette()
  setupPalette = () => {
    $('.swatch').click(e => {
      const { target } = e

      const $currSwatch = $('.selected')
      $currSwatch.removeClass('selected')

      const $elem = $(target)
      $elem.addClass('selected')

      const nodeList = this.extract($elem)
      const [first, second] = nodeList
      current = second
    })
  }

  // TODO: Implement MapBuilder.setupMapCanvas
  setupMapCanvas = () => {
    const $map = this.$elem.find('.map')
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.height; i++) {
      const $row = $('<div>').addClass('row').appendTo($map)
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < this.width; j++) {
        $('<div>').addClass('tile swatch grass').appendTo($row)
      }
    }

    // Event handlers
    $('.tile').mouseenter(({ target }) => {
      const $curr = $(target)
      const nodeList = this.extract($curr)
      // console.log('element:', current)
      // console.log("attr", $curr.data("attr"));
      // console.log("new", $curr.data("new"));

      // Third element is the swatch name
      const [first, second, third] = nodeList
      const pre = third
      $curr.removeClass(nodeList[2])
      $curr.data('attr', current)
      $curr.data('prev', pre)
      $curr.addClass($curr.data('attr'))

      // console.log('prev:', $curr.data('prev'))
      // console.log('attr:', $curr.data('attr'))
      // console.log(nodeList)
    })

    $('.tile').mouseout(({ target }) => {
      const $curr = $(target)
      const nodeList = this.extract($curr)
      if (!mouseIsDown) {
        $curr.removeClass($curr.data('attr'))
        $curr.addClass($curr.data('prev'))
      }
      // console.log(nodeList)
    })

    $('.tile').mousedown(({ target }) => {
      mouseIsDown = true
      const $curr = $(target)
      $curr.removeClass($curr.data('attr'))
      $curr.data('prev', current)
      $curr.addClass(current)
    })

    $('.tile').mouseup(({ target }) => {
      mouseIsDown = false
    })
  }
}
