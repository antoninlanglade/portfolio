import RAF from 'raf'
import Store from 'utils/Store'
import CanvasContainer from 'abstract/CanvasContainer'

export default class Scene extends CanvasContainer {
  size
  canvas = document.createElement('canvas')
  ctx = this.canvas.getContext('2d')
  className = 'scene'

  init () {}

  start () {
    this.init()
    RAF.add(this.tick)
  }

  stop () {
    RAF.remove(this.tick)
  }

  getCtx = () => this.ctx

  tick = (dt) => {
    this.ctx.clearRect(0, 0, this.size.width, this.size.height)

    this.update(dt)
    this.draw(dt)
  }

  resize () {
    super.resize()
    this.size = Store.get('size')
    this.canvas.width = this.size.width
    this.canvas.height = this.size.height
  }

  mount (el) {
    this.resize()
    this.canvas.classList.add(this.className)
    el.appendChild(this.canvas)
    Store.watch('size', this.resize)
  }

  unmount () {
    this.canvas.parentElement.removeChild(this.canvas)
    Store.unwatch('size', this.resize)
  }
}
