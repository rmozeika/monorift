import * as React from 'react';
// import { action } from '@storybook/addon-actions';
import SearchBar from './SearchBar';
// import { taskData, actionsData } from './Task.stories';
import Provider from '../storybook/Provider';
import createStore from '../store';
const store = createStore({});
export const defaultSearchData = {
	filterText: 'hey'
};

// export const actionsData = {
//     onPinTask: action('onPinTask'),
//     onArchiveTask: action('onArchiveTask'),
//   };

const withProvider = story => <Provider store={store}>{story()}</Provider>;
export default {
	component: SearchBar,
	title: 'SearchBar',
	//   decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
	decorators: [
		withProvider,
		story => (
			<div
				style={{
					height: '200px',
					width: '400px',
					backgroundColor: '#222C44',
					padding: '3rem'
				}}
			>
				{story()}
			</div>
		)
	],
	excludeStories: /.*Data$/
};

export const Default = () => <SearchBar tasks={defaultSearchData} />;
