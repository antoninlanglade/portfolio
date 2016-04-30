import ReactDOM from 'react-dom';
/**
 * Decorator for animate views
 * @param stores
 * @returns {Function}
 */
export var AnimationComponent = function(target) {
        var componentDidAppear = target.prototype.componentDidAppear,
            componentWillUnAppear = target.prototype.componentWillUnAppear,
            events = [];
            
        target.prototype.componentDidAppear = function() {
            var el = ReactDOM.findDOMNode(this);
            if (el) {
                el.classList.remove('animationOut');
                el.classList.add('animationIn');
            }             
            componentDidAppear && componentDidAppear.call(this);
        }
        target.prototype.componentWillUnAppear = function() {
            var el = ReactDOM.findDOMNode(this);
            if (el) {
                el.classList.remove('animationIn');
                el.classList.add('animationOut');        
            }
            componentWillUnAppear && componentWillUnAppear.call(this);
        }
};