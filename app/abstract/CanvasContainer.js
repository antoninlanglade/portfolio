import without from 'lodash/without'
import forEach from 'lodash/forEach'

export default class PixiContainer {
  constructor () {
    this.displayObjects = []
    this.resize = this.resize.bind(this)
    this.update = this.update.bind(this)
    this.dispose = this.dispose.bind(this)
  }

  addChild (child) {
    this.displayObjects.push(child)
  }

  removeChild (child) {
    if (child) {
      child.dispose && child.dispose()
      this.displayObjects = without(this.displayObjects, child)
    }
  }

  draw () {
    forEach(this.displayObjects, (object) => {
      object.draw && object.draw()
    })
  }

  update () {
    forEach(this.displayObjects, (object) => {
      object.update && object.update()
    })
  }

  resize (size) {
    forEach(this.displayObjects, (object) => {
      object.resize && object.resize(size)
    })
  }

  dispose () {
    forEach(this.displayObjects, (object) => {
      this.removeChild(object)
    });
    this.displayObjects = []
    this.destroy && this.destroy()
  }
}
