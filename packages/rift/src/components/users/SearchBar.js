import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Layout, Text, Button, styled, Input } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

import * as Actions from '@actions';
import * as Selectors from '@selectors';
import * as CallSelectors from '@selectors/call';
import * as UserSelectors from '@selectors/users';
import * as AuthSelectors from '@selectors/auth';
// export const SearchBar = (props) => {
//     return ()
// }

export class SearchBar extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { filterText: '' };
		// this.setFilterText = debounce(this.setFilterText, 1000);
		this.search = debounce(this.search, 100);
	}
	setFilterText = input => {
		console.log('set filter text');
		this.setState(() => {
			return { filterText: input };
		});
		this.search(input);
	};
	search = input => {
		console.log('running search', input);
		const { search } = this.props;

		search(input);
		// const { filterText } = this.state;
		// this.props.search(filterText);
	};
	render() {
		// const { filter } = this.props;
		const { filterText } = this.state;
		return (
			<Layout style={styles.searchContainer}>
				<Input
					placeholder="Search Users"
					value={filterText}
					onChangeText={this.setFilterText}
					// value={this.state.filterText}
					// onChangeText={this.setFilterText}
					style={styles.searchInput}
				/>
				{/* <Button style={{ flexBasis: '15%' }} onPress={this.search}>
					Search
				</Button> */}
			</Layout>
		);
	}
}

const styles = StyleSheet.create({
	searchContainer: {
		height: 50,
		padding: 8,
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: 'rgb(26, 33, 56)'
	},
	searchInput: {
		flexBasis: '80%',
		flex: 1
	}
});

// const mapStateToProps = state => {
// 	return {
// 		filter: UserSelectors.getSearchFilter(state)
// 	};
// };
const mapDispatchToProps = dispatch => {
	return {
		search: input => {
			dispatch(Actions.search(input));
		}
	};
};
export default connect(null, mapDispatchToProps)(SearchBar);
