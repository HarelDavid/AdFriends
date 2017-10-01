import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator'

import './style.scss';


@observer
export class Slider extends Component {

	static propTypes = {
		initPercentPosition: PropTypes.number,
		onChange: PropTypes.func //returns value between 0 to 100
	};

	@observable
	state = {
		animate: true,
		position: 0,
		filledWidth: 0,
		mouse_x: 0
	}

	static defaultProps = {
		initPercentPosition: 0,
		onChange: () => null
	};

	componentDidMount() {
		let {initPercentPosition} = this.props;

		this.width = ReactDOM.findDOMNode(this.refs.slider).getBoundingClientRect().width;

		if (initPercentPosition) {
			this.state.position = (this.width * initPercentPosition) / 100;
		}
	}

	@autobind
	@action
	moveThumb(e) {
		let {onChange} = this.props;
		if (e.target == this.refs.thumb) {
			this.state.position = e.nativeEvent.touches[0].clientX;
			this.state.animate = false;
		} else {
			this.state.position = e.nativeEvent.offsetX;
			this.state.animate = true;
		}

		if(this.state.position <=0) {
			this.state.position = 0;
		}
		if(this.state.position > this.width) {
			this.state.position = this.width;
		}
		onChange(this.state.position * 100 / this.width);


	}


	render() {
		let {className, center} = this.props;
		let {position, animate} = this.state;




		return (
			<div className="Slider" onClick={this.moveThumb} ref="slider">
				<div className="Slider-filled" style={{width: position}}></div>
				<div className="Slider-thumb" style={{left: position}}></div>
				<div className="Slider-responseArea" style={{left: position}} ref="thumb" onTouchMove={this.moveThumb}></div>
			</div>
		);
	}
}

export default Slider;