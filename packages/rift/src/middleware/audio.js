import * as Actions from '../actions';
class AudioController {
	constructor() {
		this.context = new (window.AudioContext || window.webkitAudioContext)();
		this.audioTag = new Audio();
		this.inboundStream = new MediaStream();
		this.initialized = false;
		window.audioStuff = {
			audioTag: this.audioTag,
			inboundStream: this.inboundStream,
			context: this.context
		};
	}
	initInboundStream() {
		this.audioTag.srcObject = this.inboundStream;
		this.addElementSource(this.audioTag);
		this.initialized = true;
	}
	addElementSource(element, connect = true) {
		const source = this.context.createMediaElementSource(element);
		if (connect) {
			this.connectToDestination(source);
		}
		return source;
	}
	addTrack(track) {
		if (!this.initialized) {
			this.initInboundStream();
		}
		this.inboundStream.addTrack(track);
		this.audioTag.play();
	}
	connectToDestination(source) {
		source.connect(this.context.destination);
	}
	createDestinationStream(connect, source) {
		const dest = this.context.createDestinationStream();
		if (connect) {
			this.connectToDestination(source);
		}
		return dest;
	}
}
const audioMiddleware = store => {
	const audioController = new AudioController();
	return next => action => {
		switch (action.type) {
			case Actions.ADD_SOURCE: {
				audioController.addElementSource(action.source);
			}
			case Actions.ADD_TRACK: {
				audioController.addTrack(action.track);
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
