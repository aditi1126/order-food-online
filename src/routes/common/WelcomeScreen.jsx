import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class WelcomeScreen extends Component {
	render(){
		return(
			<div style={{ display: "flex", flex: 1, backgroundColor: "red", justifyContent: "center", alignItems: "center", flexDirection: "column", position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
				<img src="data:image/jpeg;base64,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"
				/>
				<Link to="/order-food-online">
					<div style={{ fontWeight: 800, margin: "1.5rem" }}>Order food online..</div>
				</Link>
			</div>
		)
	}
};
