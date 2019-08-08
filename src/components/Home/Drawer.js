import React from 'react';
import Drawer from 'react-native-drawer';
import { connect } from 'react-redux';

import SideDrawerContent from './SideDrawerContent';
import * as colors from '../../styles/colors';

class HomeDrawer extends React.Component {
	state = {
		drawerDisabled: false,
	};

	closeDrawer = () => {
		this._drawer.close();
	};

	openDrawer = () => {
		this._drawer.open();
	};

	render() {
		const { children, isDrawerOpen } = this.props;
		const { drawerDisabled } = this.state;

		return (
			<Drawer
				ref={(ref) => {
					this._drawer = ref;
				}}
				open={isDrawerOpen}
				type="static"
				content={<SideDrawerContent {...this.props} />}
				acceptDoubleTap
				styles={{
					main: {
						shadowColor: colors.black,
						shadowOpacity: 0.3,
						shadowRadius: 15,
					},
				}}
				captureGestures={false}
				tweenDuration={100}
				panThreshold={0.08}
				disabled={drawerDisabled}
				openDrawerOffset={() => {
					return 100;
				}}
				panOpenMask={0.2}
				negotiatePan
			>
				{children}
			</Drawer>
		);
	}
}

const mapStateToProps = (state) => ({
	isDrawerOpen: state.ui.isDrawerOpen,
});

export default connect(mapStateToProps)(HomeDrawer);
