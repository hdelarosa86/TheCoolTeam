import React from 'react';

import './style.css';
import './phaser.min.js';

export let shopObj = {
	shop: false
}

export class App extends React.Component {
	constructor(){
		super()
	}
	render() {
		return (
			<div style={{ textAlign: 'center' }}>New Flag</div>
		);
	}
}
