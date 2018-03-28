import CanvasContainer from 'abstract/CanvasContainer'
import SceneMap from 'components/canvas/sceneMap/SceneMap'

export default class Line extends CanvasContainer {
  constructor (props) {
    super(props);
    this.start = props.start
    this.end = props.end
    this.color = props.color;
    this.lineWidth = props.lineWidth || 1;
  }

  draw () {
    super.draw()
    const ctx = SceneMap.getCtx()

    ctx.beginPath()
    ctx.strokeStyle = this.color;
    ctx.lineCap = 'butt';
    ctx.lineWidth = this.lineWidth
    ctx.moveTo(this.start.x, this.start.y)
    ctx.lineTo(this.end.x, this.end.y)
    ctx.stroke()

    ctx.closePath()
  }
}
