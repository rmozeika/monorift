import * as React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Layout, Text, Button, styled, Input } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Selectors from '../selectors';
import * as CallSelectors from '../selectors/call';
import * as UserSelectors from '../selectors/users';
import * as AuthSelectors from '../selectors/auth';
// export const SearchBar = (props) => {
//     return ()
// }
const styles = StyleSheet.create({
	searchContainer: {
		height: 60,
		padding: 8,
		display: 'flex',
		flexDirection: 'column'
	},
	searchInput: {
		flexBasis: '100%',
		flex: 1,
		backgroundColor: `linear-gradient(344.2deg, #2C333A -71.57%, #1C1E22 59.28%, #121416 59.28%)`
	},
	gradient: {
		flexBasis: 40,
		minHeight: 40,
		padding: 0,
		alignItems: 'stretch',
		borderRadius: 5,
		alignSelf: 'stretch',
		boxShadow: `inset 2px 3px 10px #070709, inset -2px -2px 10px rgba(255, 255, 255, 0.05)`
	},
	borderContainer: {
		flexBasis: 43,
		padding: 3
	}
});

export class SearchBar extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { filterText: '' };
	}
	setFilterText = input => {
		this.setState({ filterText: input });
	};
	search = input => {
		const { search } = this.props;

		search(input);
		// const { filterText } = this.state;
		// this.props.search(filterText);
	};
	render() {
		const { filter } = this.props;
		return (
			<Layout style={styles.searchContainer}>
				{/* <Layout style={styles.borderContaainer}> */}
				<LinearGradient
					colors={['#2C333A', '#1C1E22', '#121416']}
					style={styles.gradient}
				>
					<Input
						placeholder="Search Users"
						value={filter}
						onChangeText={this.search}
						// value={this.state.filterText}
						// onChangeText={this.setFilterText}
						style={styles.searchInput}
					/>
				</LinearGradient>
				{/* </Layout> */}
				{/* <Button style={{ flexBasis: '15%' }} onPress={this.search}>
					Search
				</Button> */}
			</Layout>
		);
	}
}
const mapStateToProps = state => {
	return {
		filter: UserSelectors.getSearchFilter(state)
	};
};
const mapDispatchToProps = dispatch => {
	return {
		search: input => {
			dispatch(Actions.search(input));
		}
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
