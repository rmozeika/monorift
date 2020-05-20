import * as Actions from '../actions';
import { Media } from '@containers/talk/Media';
class MediaInstance {
	//videoPlayer = null;
	#element = null;
	inboundStream = new MediaStream();
	initialized = false;
	tracks = {};
	userMediaStream = null;
	constructor(element, type) {
		this.#element = element;
		this.addTrack = this.addTrack.bind(this);
		this.type = type;
		// this.data = {
		// 	videoPlayer: null,
		// 	inboundStream: new MediaStream(),
		// 	initialized: false,
		// 	tracks: {},
		// 	userMediaStream: null
		// };
	}
	get element() {
		return this.#element;
	}
	set element(element) {
		this.#element = element;
	}
	initInboundStream = () => {
		if (this.element) {
			this.element.srcObject = this.inboundStream;
			// this.addElementSource(this.element);
			this.initialized = true;
		}
	};
	storeTrack = (id, track) => {
		this.tracks[id] = track;
	};
	// addTrack = (id, track) => {
	addTrack(id, track) {
		if (!this.initialized) {
			this.initInboundStream();
		}
		this.inboundStream.addTrack(track);
		this.storeTrack(id, track);
		this.element.play();
		// super(id, track)
	}
	endTrack = id => {
		console.log('instance: end track', id);
		const track_id = this.tracks[id].id;
		const track = this.inboundStream.getTrackById(track_id);
		track.stop();
		delete this.tracks[id];
		this.endSendingTrack();
	};
	endSendingTrack = () => {
		if (Object.keys(this.tracks).length < 1) {
			this.userMediaStream.getTracks().forEach(track => track.stop());
		}
	};
	getUserMedia = async constraints => {
		if (this.userMediaStream) {
			return this.userMediaStream;
		}
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		this.userMediaStream = stream; // make variable available to browser console
		return stream;
	};
	log(method, result) {
		console.log(this.type, method, result);
	}
}
class AudioInstance extends MediaInstance {
	constructor(element) {
		super(element, 'audio');
		this.context = new (window.AudioContext || window.webkitAudioContext)();
		this.addTrack = this.addTrack.bind(this);
	}
	// addTrack = (id, track) => {
	addTrack(id, track) {
		console.log('instance: add track', id);
		super.addTrack(id, track);
	}
	connectToDestination(source) {
		source.connect(this.context.destination);
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
	createDestinationStream(source, connect = true) {
		const dest = this.context.createMediaStreamDestination();
		source.connect(dest);
		if (connect) {
			// this.connectToDestination(source);
		}
		return dest;
	}
}

class VideoInstance extends MediaInstance {
	constructor(element) {
		super(element, 'video');
	}
	setVideoPlayer(element) {
		console.log(this);
		this.element = element.current;
	}
}
// class AdvancedAudio extends Audio
class AudioController {
	audioTag = new Audio();
	#audioInstance = null;

	#videoInstance = null; //new VideoInstance(null);
	// #mediaInstances = {
	// 	audio: this.#audioInstance,
	// 	video: this.#videoInstance
	// }
	#mediaInstances = {
		audio: null, //this.#audioInstance,
		video: null // this.#videoInstance
	};
	//#audioProxy = this.createMediaProxy(this.#audioInstance);
	#proxies = this.mediaProxier(this.#mediaInstances);
	tracks = {};
	// get audioProxy() {
	// 	return this.#audioProxy;
	// }
	get mediaInterface() {
		return this.#proxies;
	}

	constructor() {
		this.context = new (window.AudioContext || window.webkitAudioContext)();
		this.#audioInstance = new AudioInstance(this.audioTag);
		this.#videoInstance = new VideoInstance(null);
		this.#mediaInstances = {
			audio: this.#audioInstance,
			video: this.#videoInstance
		};
		//#audioProxy = this.createMediaProxy(this.#audioInstance);
		this.#proxies = this.mediaProxier(this.#mediaInstances);
		window.instances = this.#mediaInstances;
		window.interfaces = this.mediaInterface;
		this.videoPlayer = null;
	}
	mediaProxier(obj) {
		const controller = this;
		let handler = {
			get(target, propKey, receiver) {
				const controllerMethod =
					controller[propKey] || controller.defaultInstanceMethod;

				//const instanceType =  'audio'; //this[propKey]
				// const origMethod = target[instanceType][propKey];
				return function(...args) {
					const instanceType = controllerMethod.apply(controller, args);
					const instance = target[instanceType];
					const origMethod = instance[propKey];

					// const instanceType = 'audio';
					let result = origMethod.apply(instance, args);
					try {
						console.log(
							propKey + JSON.stringify(args) + ' -> ' + JSON.stringify(result)
						);
					} catch (e) {
						console.log('caught error while logging: ignore');
					}

					return result;
				};
			}
		};
		return new Proxy(obj, handler);
	}

	defaultInstanceMethod() {
		return 'audio';
	}
	storeTrack(id, track) {
		this.tracks[id] = track.kind || 'audio';
	}
	// Runs this controller method before passing to instance
	// return 'audio' or 'video' to specify which instance to run on
	addTrack(id, track) {
		console.log(track.kind, 'add track', id);
		this.storeTrack(id, track);
		return track.kind;
		// if (track.kind == 'audio' && this.audioInstance) {
		// 	this.audioInstance.addTrack(id, track);
		// 	return;
		// }
		// if (!this.initialized) {
		// 	this.initInboundStream();
		// }
		// this.inboundStream.addTrack(track);
		// this.storeTrack(id, track);
		// this.audioTag.play();
	}
	endTrack(id) {
		console.log('end track', id);
		const type = this.tracks[id];
		delete this.tracks[id];
		console.log('end track type', type);
		return type;
		// TODO: delete from both types if both
	}
	getUserMedia(constraints) {
		if (constraints.video) return 'video';
		return 'audio';
	}
	setVideoPlayer(ref) {
		return 'video';
	}
	addElementSource(source) {
		const type = source.tagName.toLowercase();
		console.log(type);
		return type;
	}
}
const audioMiddleware = store => {
	const audioController = new AudioController();
	// const { proxiedInstances } = audioController;
	//const audioInterface = audioController.audioProxy;
	const mediaInterface = audioController.mediaInterface;
	return next => async action => {
		switch (action.type) {
			case Actions.ADD_SOURCE: {
				const source = mediaInterface.addElementSource(action.source);
				return source;
				// break;
			}
			case Actions.ADD_TRACK: {
				mediaInterface.addTrack(action.id, action.track);
				break;
			}
			case Actions.END_CALL: {
				mediaInterface.endTrack(action.id);
				next(action); // let other reducers accept action
				break;
			}
			case Actions.GET_USER_MEDIA: {
				const stream = await mediaInterface.getUserMedia(action.constraints);
				console.log('get user media stream', stream);
				//const stream = await audioController.getUserMedia(action.constraints);
				return stream;
				// break;
			}
			// CHANGE THIS
			case Actions.SET_VIDEO_PLAYER: {
				mediaInterface.setVideoPlayer(action.ref);
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
