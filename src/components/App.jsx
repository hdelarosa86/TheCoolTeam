import React from 'react';

export let shopObj = {
	shop: false
}

export class App extends React.Component {
	constructor(){
		super()
	}
	render() {
		console.log(this.props)
		return (
			<div style={{ textAlign: 'center' }} > what to do</div>
		);
	}
}
