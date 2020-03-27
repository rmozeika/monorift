import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import Gravatar from '@components/users/Gravatar';

import * as Selectors from '@selectors';
import * as CallSelectors from '@selectors/call';
import { useSelector } from 'react-redux';
import * as AuthSelectors from '@selectors/auth';

import {
	Layout,
	Text,
	Button,
	ButtonGroup,
	styled,
	Icon,
	List,
	ListItem,
	withStyles,
	Toggle
} from '@ui-kitten/components';
import { loadData } from '@src/actions';

const styles = StyleSheet.create({
	listItem: {
		margin: 4,
		borderRadius: 12,
		// boxShadow: `-8px 8px 5px #111522, 8px -8px 5px #334168;`,
		boxShadow: ` 8px 8px 5px #161c30, 
		-8px -8px 5px #1e2640`,

		// LATEST boxShadow: `-23px 23px 46px #171d2f, 23px -23px 46px #2d395b`,
		backgroundColor: `linear-gradient(225deg, #242e4a, #1f273e)`,

		// boxShadow: `20px 60px #171d2f, -20px -20px 60px #2d395b`
		flexBasis: '90%',
		flexGrow: 1,
		// flexWrap: 'wrap',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		// flexShrink: 1
		// shadowColor: '#000',
		// shadowOffset: { width: 0, height: 1 },
		// shadowOpacity: 0.8,
		// shadowRadius: 1,
		padding: 0,
		paddingHorizontal: 0,
		paddingVertical: 0,
		zIndex: 9,
		// MAY NEED TO DIABLE -REACTIVATE FOR FLEX POSITION
		alignContent: 'flex-end'
		// marginHorizontal: 0,
		// marginVertical:0
	},
	listItemMain: {
		backgroundColor: 'inherhit',
		flexBasis: '50%',
		zIndex: 10,
		// MAY NEED TO REACTIVATE FOR FLEX POSITION
		// height: '55%',
		justifyContent: 'center',
		alignSelf: 'center',
		display: 'flex',
		flexDirection: 'row',
		alignContent: 'center',
		width: '100%',
		flexGrow: 1
		// justifyContent: 'center'
	},
	gravatarContainer: {
		flexBasis: '40%',
		backgroundColor: 'inherit',
		// alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'flex-end'
		// borderRadius: '50%',
	},
	// gravatarContainerOnline: {

	// }
	titleContainer: {
		flexBasis: '50%',
		flexGrow: 1,
		backgroundColor: 'inherit',
		alignContent: 'center',
		justifyContent: 'center'
	},
	buttonContainer: {
		// position: 'absolute',
		// right: '0px
		// left: '70%',
		// right: '-5%',
		// top: '0%',
		// height:'20%',
		// width: '25%'
		flexBasis: '25%',
		justifySelf: 'flex-end',
		width: '100%'
	},
	statusBar: {
		flexBasis: '15%',
		// flexBasis: '100%',
		textAlign: 'center',
		borderTopRightRadius: 4,
		borderTopRightRadius: 4,
		justifySelf: 'flex-end',
		width: '100%'
	},
	listItemTitle: {
		fontSize: 13,
		fontWeight: 600,
		textAlign: 'start',
		alignContent: 'center',
		paddingLeft: 10
	},
	listItemDetails: {
		fontSize: 10,
		fontWeight: 400,
		textAlign: 'start',
		alignContent: 'center',
		paddingRight: 20
		// paddingLeft: 10
	},

	icon: {
		width: 24,
		height: 24,
		marginHorizontal: 8,
		tintColor: '#8F9BB3'
		// position: 'absolute'
	},
	iconContainer: {
		position: 'absolute',
		// left: '-100px'
		top: -140,
		left: -150
		// left: '-180px'
	},
	activityContainer: {
		position: 'absolute',
		// left: '-100px'
		left: '5%',
		// top: '50%',
		backgroundColor: 'inherit',
		zIndex: 20,
		top: '5%'
		// left:
	},
	button: {
		flex: 1
	},
	listItemTouchable: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'row'
	},
	// REMOVE
	pseudoButtonGroup: {
		maxWidth: '50%',
		display: 'flex'
	}
});
class YourProfile extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	render() {
		const { self, themedStyle } = this.props;
		const { username, displayName, src } = self;
		const onlineBorderColor = themedStyle['iconOnline'].color;

		return (
			<ListItem key={'self'} style={[styles.listItem, { padding: 0 }]}>
				<Layout style={styles.listItemMain}>
					<Gravatar
						style={styles.gravatarContainer}
						online={true}
						username={username}
						onlineBorderColor={onlineBorderColor}
					/>
					<Layout style={styles.titleContainer}>
						<Text style={styles.listItemTitle}>{username}</Text>
						{/* <Text style={styles.listItemDetails}>online</Text> */}
					</Layout>
				</Layout>
			</ListItem>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setTabView: tab => dispatch(Actions.setTabView(tab))
	};
};
const mapStateToProps = state => {
	return {
		self: AuthSelectors.getSelfUser(state)
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(YourProfile);
