export default class OldAudio {
	createMediaProxy(obj) {
		let handler = {
			get(target, propKey, receiver) {
				const origMethod = target[propKey];
				return function(...args) {
					let result = origMethod.apply(this, args);
					console.log(
						propKey + JSON.stringify(args) + ' -> ' + JSON.stringify(result)
					);
					return result;
				};
			}
		};
		return new Proxy(obj, handler);
	}
	constructor() {
		this.context = new (window.AudioContext || window.webkitAudioContext)();
		//this.audioTag = new Audio();
		//this.audioInstance = new AudioInstance(this.audioTag);
		//this.audioProxy = this.createMediaProxy(this.audioInstance);
		window.instances = this.mediaInterface;

		// this.inboundStream = new MediaStream();
		// this.inboundVideoStream = new MediaStream();
		// this.userMediaStream = null;
		// this.initialized = false;
		// this.tracks = {};
		this.videoPlayer = null;
		// this.video = {
		// 	videoPlayer: null,
		// 	inboundStream: new MediaStream(),
		// 	initialized: false,
		// 	tracks: {},
		// 	userMediaStream: null
		// };
		// this.audio = {
		// 	audioTag: new Audio(),
		// 	inboundStream: new MediaStream(),
		// 	initialized: false,
		// 	tracks: {},
		// 	userMediaStream: null
		// };
		// window.audioStuff = {
		// 	audioTag: this.audioTag,
		// 	inboundStream: this.inboundStream,
		// 	context: this.context,
		// 	tracks: this.tracks,
		// 	userMediaStream: this.userMediaStream,
		// 	videoPlayer: this.videoPlayer
		// };
	}
	addTrack(id, track) {
		if (track.kind == 'audio' && this.audioInstance) {
			this.audioInstance.addTrack(id, track);
			return;
		}
		if (!this.initialized) {
			this.initInboundStream();
		}
		this.inboundStream.addTrack(track);
		this.storeTrack(id, track);
		this.audioTag.play();
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

	addVideoTrack(id, track) {
		if (!this.videoInitialized) {
			this.initInboundVideoStream();
		}
		this.inboundVideoStream.addTrack(track);
		videoRef.current.srcObject = inboundStream;
	}
	endTrack(id) {
		const track_id = this.tracks[id].id;
		const track = this.inboundStream.getTrackById(track_id);
		track.stop();
		delete this.tracks[id];
		this.endSendingTrack();
	}
	endSendingTrack() {
		if (Object.keys(this.tracks).length < 1) {
			this.userMediaStream.getTracks().forEach(track => track.stop());
		}
	}
	async getUserMedia(constraints) {
		if (this.userMediaStream) {
			return this.userMediaStream;
		}
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		this.userMediaStream = stream; // make variable available to browser console
		return stream;
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
	setVideoPlayer(ref) {
		this.videoPlayer = ref;
		this.videoInstance = new MediaInstance(ref);
	}
}
