import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import _ from '_';
import {assets} from './';
import {FunctionLoader} from './';

function uniqueId() {
	return _.uniqueId('react_assetItem_');
}

export class Asset extends React.Component {
	/**
	 * Constructor
	 * @param  {Object} props
	 */
	constructor(props) {
		super(props);

		this.state = _.clone(props);
		this.state.name = props.name || uniqueId();

		if (typeof props.src === 'function') {
			throw new Error('Asset cannot load a function');
		}

	}

	/**
	 * Component Mount
	 */
	componentDidMount() {
		this.$component = $(ReactDOM.findDOMNode(this.refs.component));
		this.load();
    }

    /**
	 * Component UnMount
	 */
    componentWillUnmount() {
    	this.$component = null;
    }

    /**
	 * Disable upadte
	 */
	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	/**
	 * Get new params when trying to update
	 * @param {Object} nextProps
	 */
	componentWillReceiveProps(nextProps) {
		if(this.state.src !== nextProps.src) {
			this.state = _.clone(nextProps);
			if(!nextProps.name) {
				this.state.name = props.name || uniqueId();
			}

			this.load();
		}
	}

	/**
	 * Load the asset
	 */
	load() {
		var src = this.state.src || assets.getAssetFromName(this.state.name);

		if (src === void(0) || src === null) {
			return null;
		}

		var loading = assets.add(src, this.state.name, this.state.group, this.state);

		if (this.$component) {
			var item = assets.getAssetFromName(this.state.name);
			item.content.setAttribute('data-reactid', this.$component.attr('data-reactid'));
			this.$component.replaceWith(item.content);
			this.$component = $(item.content);
			this.setupAttributes(item.content, this.state);
		}

		return loading;
	}

	/**
	 * Setup Attributes of DOMNode
	 * @param {DOMNode} component 
	 * @param {Object} attributes
	 */
	setupAttributes(component, attributes) {
		for(var key in attributes){
			var val = attributes[key];

			if (key === 'className') {
				key = 'class';
			}

			if (typeof val === 'function') {
				component[key.toLowerCase()] = val;
			}
			// Security for disallow reload src attr
			else if (key !== 'src') {
				component.setAttribute(key, val);
			}
		}
	}

	/**
	 * Render
	 */
    render() {
    	return(
    		<span className={this.props.className} ref="component"></span>
		);
    }
}