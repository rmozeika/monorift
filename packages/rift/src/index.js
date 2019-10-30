import { AppRegistry } from 'react-native';
import App from './root';
// import {name as appName} from '../app.json';

AppRegistry.registerComponent('rift', () => App);

AppRegistry.runApplication('rift', {
  rootTag: document.getElementById('root')
});