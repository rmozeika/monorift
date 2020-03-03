import { AppRegistry } from 'react-native';
import App from './root';

AppRegistry.registerComponent('rift', () => App);

AppRegistry.runApplication('rift', {
	rootTag: document.getElementById('root')
});
