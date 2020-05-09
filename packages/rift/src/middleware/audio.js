import * as Actions from '../actions';
class AudioController {
	constructor() {
		this.context = new (window.AudioContext || window.webkitAudioContext)();
		this.audioTag = new Audio();
		this.inboundStream = new MediaStream();
		this.initialized = false;
		this.tracks = [];
		window.audioStuff = {
			audioTag: this.audioTag,
			inboundStream: this.inboundStream,
			context: this.context,
			tracks: this.tracks
		};
	}
	storeTrack(track) {
		this.tracks.push(track);
	}
	initInboundStream() {
		this.audioTag.srcObject = this.inboundStream;
		this.addElementSource(this.audioTag);
		this.initialized = true;
	}
	addElementSource(element, connect = true) {
		const source = this.context.createMediaElementSource(element);
		if (connect) {
			// this.connectToDestination(source);
			const dest = this.createDestinationStream(source); //, false);
			return dest;
		} else {
			return source;
		}
	}
	addTrack(track) {
		if (!this.initialized) {
			this.initInboundStream();
		}
		this.inboundStream.addTrack(track);
		this.storeTrack(track);
		this.audioTag.play();
	}
	connectToDestination(source) {
		source.connect(this.context.destination);
	}
	createDestinationStream(source, connect = true) {
		const dest = this.context.createMediaStreamDestination();
		source.connect(dest);
		if (connect) {
			// this.connectToDestination(source);
		}
		return dest;
	}
}
const audioMiddleware = store => {
	const audioController = new AudioController();
	return next => action => {
		switch (action.type) {
			case Actions.ADD_SOURCE: {
				const source = audioController.addElementSource(action.source);
				return source;
				// debugger; //remove
				// break;
			}
			case Actions.ADD_TRACK: {
				audioController.addTrack(action.track);
				break;
			}

			//         touchTone.play(action.tones);
			//         break;
			default:
				next(action);
				break;
		}
	};
};

export default audioMiddleware;
