import CanvasContainer from 'abstract/CanvasContainer'
import SceneMap from 'components/canvas/sceneMap/SceneMap'

export default class Circle extends CanvasContainer {
  constructor (props) {
    super(props);
    this.x = props.x;
    this.y = props.y;
    this.r = props.r;
    this.color = props.color;
  }

  draw () {
    super.draw()
    const ctx = SceneMap.getCtx()

    ctx.beginPath()
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    ctx.fill()

    ctx.closePath()
  }
}
