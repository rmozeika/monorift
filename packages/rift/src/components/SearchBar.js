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
		padding: 8,
		display: 'flex',
		flexDirection: 'row'
	},
	searchInput: {
		flexBasis: '80%',
		flex: 1
	}
});

export class SearchBar extends React.PureComponent {
	constructor(props) {
		super(props);
		this.search = this.search.bind(this);
		this.setFilterText = this.setFilterText.bind(this);
		// this.setState({ filterText: '' });
		this.state = { filterText: '' };
	}
	setFilterText(input) {
		this.setState({ filterText: input });
	}
	search(input) {
		const { search } = this.props;
		console.log('FILTER', 'search changed');

		search(input);
		// const { filterText } = this.state;
		// this.props.search(filterText);
	}
	render() {
		const { filter } = this.props;
		return (
			<Layout style={styles.searchContainer}>
				<Input
					placeholder="Search Users"
					value={filter}
					onChangeText={this.search}
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
