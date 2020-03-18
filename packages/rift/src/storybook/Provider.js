import React from 'react';
// import { Router } from 'react-router';
import { Provider } from 'react-redux';

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { mapping, light as lightTheme, dark } from '@eva-design/eva';

import {
	AwesomeIconsPack
	// FeatherIconsPack
} from '../core/icons';
const ProviderWrapper = ({ children, store }) => (
	<Provider store={store}>
		<IconRegistry icons={[AwesomeIconsPack]} />
		<ApplicationProvider mapping={mapping} theme={dark}>
			{children}
		</ApplicationProvider>
	</Provider>
);

export default ProviderWrapper;
