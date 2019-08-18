import React, { memo } from 'react';

const styles = {
	outerContainer: { display: "flex", minHeight: "100vh" },
	content: { display: "flex", flex: 1, backgroundColor: "#fff" },
};

const Dashboard = (props) => (
			<div style={styles.outerContainer}>
				<div style={styles.content}>
					{props.renderFilterSection()}
					{props.renderMenu()}
					{props.renderOrderSummary()}
				</div>
				{props.renderFooter()}
			</div>
);

export default memo(Dashboard);
