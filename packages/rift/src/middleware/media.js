import * as Actions from '../actions';
import { AudioElement, AppAudioContext } from './media-elements/audio';
import { result } from 'lodash';
class MediaInstance {
	//videoPlayer = null;
	#element = null;
	#elements = [];
	inboundStream = new MediaStream();
	initialized = false;
	tracks = {};
	userMediaStream = null;
	constructor(element, type) {
		this.#element = element;
		this.#elements = [element];
		this.addTrack = this.addTrack.bind(this);
		this.type = type;
		this.state = {
			players: {
				default: {
					stream: this.inboundStream, //new MediaStream(),
					element: this.#element,
					user_id: false,
					active: false,
					initialized: false
				}
			},
			ids: []
		};
		// this.data = {
		// 	videoPlayer: null,
		// 	inboundStream: new MediaStream(),
		// 	initialized: false,
		// 	tracks: {},
		// 	userMediaStream: null
		// };
	}
	set player({ id, config }) {
		console.log('set player', id, config);
		this.state.players[id] = { ...this.state.players[id], ...config };
	};
	get element() {
		return this.#element;
	}
	set element(element) {
		this.#element = element;
	}
	initInboundStream = (id, player) => {
		const { element, stream } = player;
		if (element) {
			element.srcObject = stream;
			// this.addElementSource(this.element);
			//initialized = true;
			this.player = { id, config: { element, initialized: true } };
			if (element?.play) {
				element.play();
			}
		}
	};
	storeTrack = (id, track) => {
		this.tracks[id] = track;
	};
	addTrackToStream(player_id, track) {
		this.state.players[player_id].stream.addTrack(track);

	}
	addTrack(id, track) {
		const { id: player_id, player } = this.attachPlayer(id, track);
		if (!player.initialized) {
			this.initInboundStream(player_id, player);
		}	
		try {
			this.addTrackToStream(player_id, track);
			// player.stream.addTrack(track);
		} catch (e) {
			// TODO HANDLE THIS, already added for sender
			console.error('Error adding track');
			console.trace(e);
		}

		this.storeTrack(id, track);
		if (player.element?.play) {
			player.element.play();
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
	createPlayer({element = false, user_id, track}) {
		return { 
			element: element || this.createNewElement(),
			//user_id,
			stream: new MediaStream(),
			initialized: false,
			active: false,
			//track,

		};
	}
	getPlayerKey = (user_id) => {
		const key = (this.state.players[user_id]) ? user_id : 'default';
		return key;
	}
	getAvailablePlayer = (user_id) => {
		//let player;
		const existingIdx = this.state.ids.indexOf(user_id);
		if (existingIdx > 0) {
			const id = this.getPlayerKey(user_id);
			return { id, player: this.state.players[id] };
		}
		if (this.state.ids.length == 0) {
			return {id: 'default', player: this.state.players.default};
		}
		//  else {
			// const freeIndex = this.state.ids.find(idx => {
			// 	return !this.state.players[idx].active;
			// });
			// if (freeIndex) player = this.state.player
		const player = this.createPlayer({});
		//this.player()
		//this.state.players[user_id]  = player;

		//}
		return  { id: user_id, player} ;
	}
	
	attachPlayer(user_id, track) {
		const { id, player } = this.getAvailablePlayer(user_id, track);
		if (id !== 'default') {
			this.state.players[user_id] = player;
		}
		this.state.ids.push(user_id);
		// this.state.players[user_id] = player;
		this.state.players[id].user_id = user_id; 
		return {id, player: this.state.players[id] };
		


		
		// this.state.push({
		// 	user_id,
		// 	element: 
		// })
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
	createNewElement() {
		return new AudioElement();
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
	addTrack(id, track) {
		super.addTrack(id, track);
	}
	createNewElement() {
		const element = document.createElement('video');

		// if (myVideo.canPlayType('video/mp4')) {
		//   myVideo.setAttribute('src','videofile.mp4');
		// } else if (myVideo.canPlayType('video/webm')) {
		//   myVideo.setAttribute('src','videofile.webm');
		// }
		
		// myVideo.width = 480;
		// myVideo.height = 320;
		return element;
	}
	setVideoPlayer(element, containerRef) {
		// if (!id) {
			// if (Object.keys(this.tracks).length > 0) {
			const player_ids = this.state.ids;
			player_ids.forEach(user_id => {
				const id = this.getPlayerKey(user_id);
				if (id == 'default') {
					this.state.players.default.element = element.current;
				} else {
					this.appendVideoPlayer(this.state.players[id].element, containerRef);

				}
				this.initInboundStream(id, this.state.players[id]);
			});
				
		// }
	}
	appendVideoPlayer(element, containerRef) {
		containerRef.appendChild(element);
	}
}


// Called before each corresponding method
// Returns which instance type to run on e.g. ['audio] or ['audio', 'video'] or ['video']
// Runs any logic to be executed before
const BeforeMediaAction = {
	addTrack: Symbol('addTrack'),
	endTracks: Symbol('endTracks'),
	endTrack: Symbol('endTrack'),
	getUserMedia: Symbol('getUserMedia'),
	setVideoPlayer: Symbol('setVideoPlayer'),
	addElementSource: Symbol('addElementSource')
};
class MediaController {
	audioTag = new AudioElement();
	#audioInstance = null;

	#videoInstance = null;

	#mediaInstances = {
		audio: null, //this.#audioInstance,
		video: null // this.#videoInstance
	};
	#avUserMediaStream = null;
	#proxies = this.mediaProxier(this.#mediaInstances);
	tracks = {};

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
	//	Controller houses proxy for interaction with AudioInstance and VideoInstance
	//  Maintains communal state for both media types
	//
	// e.g. USER CALLS: mediaInterface.getUserMedia(action.constraints);
	//
	// Operations automatically executed as follows:
	//
	// 1. Proxy automatically calls MediaController[MediaTypes.getUserMedia] resolves to MediaController[Symbol('getUserMedia)])
	//
	//		Returns which instance type to run on e.g. ['audio] or ['audio', 'video'] or ['video']
	//  	Symbols as method names so matching method name can be separated into pre, post commands of same name
	//		Run any pre operation logic here
	//
	// 2. Calls method directly on corresponding media instances (AudioInstance, VideoInstance, or both)
	// 	e.g. AudioInstance.getUserMedia(args) & VideoInstance.getUserMedia(args) returned from media types in previous step

	// 3. Post operation logic run to maintain state within the controller
	//	e.g. MediaController.getUserMedia(args);

	mediaProxier(obj) {
		const controller = this;
		let handler = {
			get(target, propKey, receiver) {
				const typeSymbol = BeforeMediaAction[propKey];
				const controllerMethod =
					controller[typeSymbol] || controller.defaultInstanceMethod;
				const parseResult = controller[propKey];
				//const instanceType =  'audio'; //this[propKey]
				// const origMethod = target[instanceType][propKey];
				return function(...args) {
					// const resultTasks = controllerMethods.map(controllerMethod => {
					const instanceTypes = controllerMethod.apply(controller, args);
					const resultTasks = instanceTypes.map(instanceType => {
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
						resultTasks.some(result => {
							return result?.then;
						});

					const onComplete = operationResults => {
						if (parseResult && operationResults) {
							return parseResult(operationResults);
							//return parsed;
						}
						return operationResults;
					};
					const singleUnitResult = (resultArr = []) => {
						if (resultArr.length === 1) {
							return resultArr[0];
						}
						return resultArr;
					};
					let operationsComplete = resultTasks;
					if (isAsync) {
						let asyncOperation = async () => {
							operationsComplete = await Promise.all(resultTasks);
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
		const { audio, video } = this.tracks[user_id];
		if (audio == track_id) this.tracks[user_id].audio = false;
		if (video == track_id) this.tracks[user_id].video = false;
		if (!audio && !video) delete this.tracks[user_id];
	};
	// Runs this controller method before passing to instance
	// return 'audio' or 'video' to specify which instance to run on
	[BeforeMediaAction.addTrack](id, track) {
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
	[BeforeMediaAction.endTracks](ids) {
		return this.allInstanceTypes;
	}
	get tracksList() {
		return Object.keys(this.tracks).map(key => this.tracks[key]);
	}
	endTracks = tracksToEnd => {
		const { tracksList } = this;
		tracksToEnd.flat().forEach(this.removeTrack);
		if (tracksList.length < 1) {
			this.#avUserMediaStream = null;
		}
	};
	[BeforeMediaAction.endTrack](id) {
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
	[BeforeMediaAction.getUserMedia](constraints) {
		const types = [];
		if (constraints.video) types.push('video');
		if (constraints.audio) types.push('audio');
		return types;
	}
	[BeforeMediaAction.setVideoPlayer](ref) {
		return ['video'];
	}
	[BeforeMediaAction.addElementSource](source) {
		const type = source.tagName.toLowercase();
		console.log(type);
		return [type];
	}
}

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
				mediaInterface.setVideoPlayer(action.ref, action.containerRef);
				break;
			}
			default:
				next(action);
				break;
		}
	};
};

export default audioMiddleware;
