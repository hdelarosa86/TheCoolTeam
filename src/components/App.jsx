import React from 'react';
import './style.css';

export let shopObj = {
	shop: false
}

export class App extends React.Component {
	constructor(){
		super()
	}
	render() {
		return (
			<div>
			<div className="header" style={{ textAlign: 'center' }}>Fullstack Town</div>
			<div className="subheader" style={{ textAlign: 'center' }}>This is for educational purposes. This is also a non-commercial parody.</div>
			</div>
		);
	}
}
