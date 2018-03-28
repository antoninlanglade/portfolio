import throttle from 'lodash/throttle';
import Store from 'utils/Store';

function Resize () {
  let resizeDebounce = throttle(resize, 200);

  function resize (e) {
    Store.set('size', { width: window.innerWidth, height: window.innerHeight });
  }

  function init () {
    resize();
    window.addEventListener('resize', resizeDebounce);
  }

  function remove () {
    window.removeEventListener('resize', resizeDebounce);
  }

  return {
    init,
    remove
  };
}
export default Resize();
