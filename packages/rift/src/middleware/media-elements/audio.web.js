// export const AudioElement = new Audio();
export class AudioElement extends Audio {
	constructor(...args) {
		super(args);
	}
}

// this.context = new (window.AudioContext || window.webkitAudioContext)();
const AudioContextBase = window.AudioContext || window.webkitAudioContext;
export class AppAudioContext extends AudioContextBase {
	constructor(...args) {
		super(...args);
	}
}
