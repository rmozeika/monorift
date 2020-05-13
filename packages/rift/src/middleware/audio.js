import * as Actions from '../actions';
class AudioController {
	constructor() {
		this.context = new (window.AudioContext || window.webkitAudioContext)();
		this.audioTag = new Audio();
		this.inboundStream = new MediaStream();
		this.initialized = false;
		this.tracks = {};
		window.audioStuff = {
			audioTag: this.audioTag,
			inboundStream: this.inboundStream,
			context: this.context,
			tracks: this.tracks
		};
	}
	storeTrack(id, track) {
		this.tracks[id] = track;
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
	addTrack(id, track) {
		if (!this.initialized) {
			this.initInboundStream();
		}
		this.inboundStream.addTrack(track);
		this.storeTrack(id, track);
		this.audioTag.play();
	}
	endTrack(id) {
		const track_id = this.tracks[id].id;
		const track = this.inboundStream.getTrackById(track_id);
		track.stop();
		delete this.tracks[id];
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
				audioController.addTrack(action.id, action.track);
				break;
			}
			case Actions.END_CALL: {
				audioController.endTrack(action.id);
				next(action); // let other reducers accept action
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
