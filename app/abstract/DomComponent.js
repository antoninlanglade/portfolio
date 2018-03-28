export default class DomComponent {
  constructor (props) {
    // Add your DOM references to this.refs
    this.refs = {}

    this.timers = []

    this.destroyed = false
    this.mounted = false

    this._props = props

    this.didInit(props)
  }

  addRef (name, ref, params) {
    let instance;

    if (!ref || !name) {
      console.warn(`Need (name & ref) for => ${name} ${ref}`);
      return;
    }

    if (ref.prototype && ref.prototype.hydrate && ref.prototype.mount) {
      instance = new ref(params);
    } else if (ref.tagName) {
      instance = ref;
    } else {
      console.warn(`Type of ref ${ref} need to be DOM Element or JS Component`);
      return false;
    }
    this.refs[name] = instance;
    return this.refs[name]
  }

  // Use it if you want to create DOM from the JS and use mount instead of hydrate
  render () {}

  // Called after the component is instantiated
  didInit () {}

  // Called just after the component is mounted to the DOM
  didMount () {}

  // Called just before the component is removed from the DOM
  willUnmount () {}

  // Use a already existing DOM element as base for the component
  hydrate (el) {
    if (!el || this.mounted) return
    this.refs.base = el
    this.mounted = true
    this.didMount(el)
  }

  // Quick helper for timer in promises
  timer (delay, cb) {
    return new Promise((resolve, reject) => {
      const self = this
      if (cb) cb = cb.bind(self)
      const timer = window.setTimeout(callback, delay)
      self.timers.push(timer)
      function callback () {
        const index = self.timers.indexOf(timer)
        if (~index) self.timers.splice(index, 1)
        resolve()
        if (cb) cb()
      }
    })
  }

  // Render DOM from the render() function into an existing DOM element
  // If you specify a sibling, the element will be inserted before it
  mount (parent, sibling = null) {
    if (!parent || this.mounted) return
    const el = this.render(this._props)
    if (!el) return
    sibling ? parent.insertBefore(el, sibling) : parent.appendChild(el)
    this.refs.base = el
    this.mounted = true
    this.didMount(el)
  }

  bindFuncs (funcs) {
    funcs.forEach((func) => {
      this[func] = this[func].bind(this);
    });
  }

  // Remove the DOM and destroy the component
  destroy () {
    if (!this.mounted) return

    // remove all dom ref
    for (let k in this.refs) {
      if (k !== 'base') {
        if (this.refs[k] && this.refs[k].willUnmount) {
          this.refs[k].willUnmount()
        }
        delete this.refs[k]
      }
    }

    // call will unmount
    this.willUnmount(this.refs.base)

    // remove from dom
    this.refs.base && this.refs.base.parentNode && this.refs.base.parentNode.removeChild(this.refs.base)

    // remove all non-finished timers
    this.timers.forEach(timer => window.clearTimeout(timer))
    this.refs = undefined
    this.timers = undefined

    this.mounted = false
    this.destroyed = true
  }
}
