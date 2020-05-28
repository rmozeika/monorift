import { Permissions } from 'react-native-unimodules';

class NativeAudio {
	srcObject = {};
	constructor() {
		this.tracks;
	}
	play() {
		console.log('play');
	}
}

export const AudioElement = NativeAudio;
