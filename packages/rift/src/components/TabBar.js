import React, { useState } from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles,
	TabView,
	Tab,
	TabBar
} from '@ui-kitten/components';

//create your forceUpdate hook
function useForceUpdate() {
	const [value, setValue] = useState(0); // integer state
	return () => setValue(value => ++value); // update the state to force render
}
function AdaptiveTabBar({ mobile, loggedIn, tab, setTopTabsIndex }) {
	const forceUpdate = useForceUpdate();
	const tabs = [
		{ title: 'Friends', condition: loggedIn },
		{ title: 'Users' },
		{ title: 'Talk', condition: mobile }
	];
	const activeTabs = tabs.filter(({ condition = true }) => condition);
	const tabBarStyles = mobile ? {} : { alignSelf: 'flex-start', width: '50vw' };
	return (
		<TabBar
			selectedIndex={tab}
			onSelect={setTopTabsIndex}
			style={[{ width: '100vw', flexGrow: 1 }, tabBarStyles]}
		>
			{activeTabs.map(({ title }) => (
				<Tab title={title} />
			))}
		</TabBar>
	);
}
export default AdaptiveTabBar;
