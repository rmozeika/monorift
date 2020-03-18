import * as React from 'react';
// import { action } from '@storybook/addon-actions';
import { Media } from './Media';
// import { taskData, actionsData } from './Task.stories';
import Provider from '../storybook/Provider';
import createStore from '../store';
const store = createStore({});
export const defaultSearchData = {
	audioRef: React.createRef(),
	videoRef: React.createRef(),
	callFunctions: {
		audio: () => true,
		video: () => true
	}
};

// export const actionsData = {
//     onPinTask: action('onPinTask'),
//     onArchiveTask: action('onArchiveTask'),
//   };

const withProvider = story => <Provider store={store}>{story()}</Provider>;
export default {
	component: Media,
	title: 'Media',
	//   decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
	decorators: [
		withProvider,
		story => (
			<div
				style={{ display: 'flex', backgroundColor: '#222C44', padding: '3rem' }}
			>
				{story()}
			</div>
		)
	],
	excludeStories: /.*Data$/
};

export const Default = () => (
	<Media
		tasks={defaultSearchData}
		callFunctions={defaultSearchData.callFunctions}
	/>
);
