import actions from './Actions'

const NS = '__STORE.'
const stored = {}

const store = {
  watch (k, cb) {
    actions.on(NS + k, cb)
  },
  watchOnce (k, cb) {
    actions.once(NS + k, cb)
  },
  unwatch (k, cb) {
    actions.off(NS + k, cb)
  },
  get (k) {
    return stored[k]
  },
  set (k, val) {
    stored[k] = val
    actions.emit(NS + k, val)
  }
}

export default store
