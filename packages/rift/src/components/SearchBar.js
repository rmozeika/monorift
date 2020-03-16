import * as React from 'react';
import { StyleSheet } from 'react-native';

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
		height: 50,
		padding: 8
	},
	searchInput: {
		width: '100%'
	}
});

class SearchBar extends React.PureComponent {
	constructor(props) {
		super(props);
		this.search = this.search.bind(this);
	}
	search(input) {
		const { search } = this.props;
		debugger;
		search(input);
	}
	render() {
		const { filter } = this.props;
		return (
			<Layout style={styles.searchContainer}>
				<Input
					placeholder="Search Users"
					value={filter}
					onChangeText={this.search}
					style={styles.searchInput}
				/>
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
