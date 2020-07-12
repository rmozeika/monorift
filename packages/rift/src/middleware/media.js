import * as Actions from '../actions';
import { AudioElement, AppAudioContext } from './media-elements/audio';
import { result } from 'lodash';
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
	addTrack(id, track) {
		if (!this.initialized) {
			this.initInboundStream();
		}
		try {
			this.inboundStream.addTrack(track);
		} catch (e) {
			// TODO HANDLE THIS, already added for sender
			console.error('Error adding track');
			console.trace(e);
		}

		this.storeTrack(id, track);
		if (this.element?.play) {
			this.element.play();
		}
	}
	getTrackByUserId = user_id => {
		return this.tracks[user_id];
	};
	endTracks(id) {
		let user_ids = [];
		if (id && Array.isArray(id)) {
			user_ids = id;
		} else if (id) {
			user_ids.push(id);
		}
		// else {
		// 	user_ids = Object.keys(this.tracks);
		// }

		const track_ids = user_ids.map(user_id => {
			const track = this.getTrackByUserId(user_id); //.id);

			return { user_id, track_id: track?.id || false };
		});
		track_ids.forEach(({ user_id, track_id }) =>
			this.endTrack(user_id, track_id)
		);
		return track_ids;
	}
	endTrack = (id, track_id) => {
		try {
			if (!this.tracks[id]) return;
			delete this.tracks[id];
			if (!track_id) return;

			console.log(
				'instance: end track',
				`user_id: ${id}`,
				`track_id: ${track_id}`
			);
			// const track_id = this.tracks[id].id;
			const track = this.inboundStream.getTrackById(track_id);
			track.stop();
			this.inboundStream.removeTrack(track);
			this.endSendingTrack();
		} catch (e) {
			console.error('Error removing track for user', id);
			console.trace(e);
		}
	};
	endSendingTrack = () => {
		// CHANGE THIS only end tracks for tracks by id
		// Don't end if active with another connection
		if (Object.keys(this.tracks).length < 1 && this.userMediaStream !== null) {
			this.userMediaStream.getTracks().forEach(track => track.stop());
			this.userMediaStream = null;
		}
	};
	getUserMedia = async constraints => {
		// REMOVE
		// if (constraints.video) {
		// 	return this.getUserMediaFacing(constraints);
		// }
		if (this.userMediaStream) {
			return this.userMediaStream;
		}
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		this.userMediaStream = stream; // make variable available to browser console
		return stream;
	};
	// REMOVE
	getUserMediaFacing = async constraints => {
		// const dimensions = { width: windowWidth, height: windowHeight };
		const dimensions = { width: 441, height: 667 };
		const sizeConstraints = {
			video: {
				...dimensions,
				facingMode: 'user'
			},
			audio: true
		};
		console.log('GET USER MEDIA, SIZE CONSTRAINTS', sizeConstraints);
		stream = await navigator.mediaDevices.getUserMedia(sizeConstraints);
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
		this.context = new AppAudioContext();
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
	getUserMedia(constraints) {
		if (constraints.video.width) constraints.video.facingMode = 'user';
		super.getUserMedia(constraints);
	}
	setVideoPlayer(element, id) {
		if (!id) {
			this.element = element.current;
			if (Object.keys(this.tracks).length > 0) {
				this.initInboundStream();
			}
		}
	}
}

const MethodTypes = {
	addTrack: Symbol('addTrack'),
	endTracks: Symbol('endTracks'),
	endTrack: Symbol('endTrack'),
	getUserMedia: Symbol('getUserMedia'),
	setVideoPlayer: Symbol('setVideoPlayer'),
	addElementSource: Symbol('addElementSource')
};
// class AdvancedAudio extends Audio
class MediaController {
	audioTag = new AudioElement();
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
	#avUserMediaStream = null;
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
		window.MediaController = this;
		this.videoPlayer = null;
	}
	mediaProxier(obj) {
		const controller = this;
		let handler = {
			get(target, propKey, receiver) {
				const typeSymbol = MethodTypes[propKey];
				const controllerMethod =
					controller[typeSymbol] || controller.defaultInstanceMethod;
				const parseResult = controller[propKey];
				//const instanceType =  'audio'; //this[propKey]
				// const origMethod = target[instanceType][propKey];
				return function(...args) {
					// const results = controllerMethods.map(controllerMethod => {
					const instanceTypes = controllerMethod.apply(controller, args);
					const results = instanceTypes.map(instanceType => {
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
					});

					let isAsync =
						parseResult?.then ||
						results.some(result => {
							return result?.then;
						});

					const onComplete = operationResults => {
						if (parseResult && operationResults) {
							return parseResult(operationResults);
							//return parsed;
						}
						return operationResults;
					};
					const singleUnitResult = resultArr => {
						if (resultArr.length === 1) {
							return resultArr[0];
						}
						return resultArr;
					};
					let operationsComplete = result;
					if (isAsync) {
						let asyncOperation = async () => {
							operationsComplete = await Promise.all(results);
							const operationsParsed = await onComplete(operationsComplete);
							return singleUnitResult(operationsParsed);
						};
						return asyncOperation();
					}
					let operationsParsed = onComplete(operationsComplete);
					return singleUnitResult(operationsParsed);
				};
			}
		};
		return new Proxy(obj, handler);
	}
	allInstanceTypes = ['audio', 'video'];
	defaultInstanceMethod(propKey) {
		return ['audio'];
	}
	storeTrack = (id, track) => {
		const type = track.kind || 'audio';
		if (!this.tracks[id]) this.tracks[id] = { video: false, audio: false };
		this.tracks[id][type] = track.id;
	};
	removeTrack = ({ track_id, user_id }) => {
		const { audio, video } = this.tracks[id];
		if (audio == track_id) this.track[id].audio = false;
		if (video == track_id) this.track[id].video = false;
		if (!audio && !video) delete this.tracks[id];
	};
	// Runs this controller method before passing to instance
	// return 'audio' or 'video' to specify which instance to run on
	[MethodTypes.addTrack](id, track) {
		console.log(track.kind, 'add track', id);
		this.storeTrack(id, track);
		return [track.kind];
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
	[MethodTypes.endTracks](ids) {
		return this.allInstanceTypes;
	}
	endTracks = tracks => {
		this.tracks.forEach(this.removeTrack);
		if (!Object.keys(this.tracks).length < 1) {
			this.#avUserMediaStream = null;
		}
	};
	[MethodTypes.endTrack](id) {
		console.log('end track', id);
		const type = this.tracks[id];
		delete this.tracks[id];
		console.log('end track type', type);
		return [type];
		// TODO: delete from both types if both
	}
	getUserMedia = streams => {
		if (streams.length < 2) return streams[0];
		const tracksByStream = streams.map(stream => {
			return stream.getTracks();
		});
		const tracksMasterlist = tracksByStream.flat();
		this.#avUserMediaStream = new MediaStream(tracksMasterlist);
		return this.#avUserMediaStream;
	};
	[MethodTypes.getUserMedia](constraints) {
		const types = [];
		if (constraints.video) types.push('video');
		if (constraints.audio) types.push('audio');
		return types;
	}
	[MethodTypes.setVideoPlayer](ref) {
		return ['video'];
	}
	[MethodTypes.addElementSource](source) {
		const type = source.tagName.toLowercase();
		console.log(type);
		return [type];
	}
}

class InstanceTypes {}
const audioMiddleware = store => {
	const mediaController = new MediaController();
	// const { proxiedInstances } = MediaController;
	//const audioInterface = MediaController.audioProxy;
	const mediaInterface = mediaController.mediaInterface;
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
			case Actions.END_CONNECTION: {
				mediaInterface.endTracks(action.id);
				next(action); // let other reducers accept action
				break;
			}
			case Actions.GET_USER_MEDIA: {
				const stream = await mediaInterface.getUserMedia(action.constraints);
				console.log('get user media stream', stream);
				//const stream = await mediaController.getUserMedia(action.constraints);
				return stream;
				// break;
			}
			case Actions.SET_VIDEO_PLAYER: {
				mediaInterface.setVideoPlayer(action.ref);
				break;
			}
			default:
				next(action);
				break;
		}
	};
};

export default audioMiddleware;
