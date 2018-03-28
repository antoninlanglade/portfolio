import Scene from 'controllers/Scene'
import Store from 'utils/Store'
import Actions from 'utils/Actions'
import Point from 'toto-point'
import last from 'lodash/last'
import Line from 'components/canvas/shapes/Line';
import pullAt from 'lodash/pullAt'

import './SceneMap.css'

class SceneMap extends Scene {
  className = 'scene-map'
  points = []

  init () {
    window.addEventListener('mousemove', this.onMouseMove)
  }

  onMouseMove = (e) => {
    if (this.points.length > 100) {
      const line = this.points[0].line
      line && this.removeChild(line)
      this.points.splice(0, 1)
    }
    const obj = {
      point: new Point(e.clientX, e.clientY)
    }
    if (this.points.length > 0) {
      obj.line = new Line({
        start: last(this.points).point,
        end: obj.point,
        color: 'white',
        lineWidth: 2
      })
      this.addChild(obj.line)
    }

    this.points.push(obj)
  }

  resize () {
    const size = Store.get('size')
    this.size = {width: size.width, height: size.height}
    this.canvas.width = this.size.width
    this.canvas.height = this.size.height
  }

  destroy () {

  }
}

let scene = new SceneMap()

export default scene
