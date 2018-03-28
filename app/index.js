import Resize from 'utils/Resize'
import App from 'components/app/App'
import CursorHelper from 'cursor-helper'

Resize.init()

const $app = document.getElementById('app')
const app = new App()
app.hydrate($app)

const key = 'draw'
CursorHelper.add(key, 10)

CursorHelper.setCursor(key, 'crosshair')
