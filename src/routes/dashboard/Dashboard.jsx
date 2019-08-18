import React from 'react';

const Dashboard = (props) => (
			<div style={{ backgroundColor: "#fff", display: "flex", minHeight: "100vh" }}>
				<div style={{ display: "flex", paddingTop: "1rem", flex: 1 }}>
					{props.renderFilterSection()}
					{props.renderMenu()}
					{props.renderOrderSummary()}
				</div>
				{props.renderFooter()}
			</div>
);

export default Dashboard;
