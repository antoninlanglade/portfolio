import DomComponent from 'abstract/DomComponent';
import scene from 'components/canvas/sceneMap/SceneMap'

import './App.css'

export default class App extends DomComponent {
  didInit () {
  }

  didMount (el) {
    scene.mount(el)
    scene.start()
  }
}
