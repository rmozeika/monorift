export const ADD_SOURCE = 'AUDIO/ADD_SOURCE';
export const addSource = source => ({
	type: ADD_SOURCE,
	source
});

export const ADD_TRACK = 'AUDIO/ADD_TRACK';
export const addTrack = (id, track) => ({
	type: ADD_TRACK,
	id,
	track
});

export const GET_USER_MEDIA = 'AUDIO/GET_USER_MEDIA';
export const getUserMedia = (constraints = { audio: true, video: false }) => ({
	type: GET_USER_MEDIA,
	constraints
});

export const PLAY_VIDEO = 'VIDEO/PlAY';
export const playVideo = () => ({ type: PLAY_VIDEO });

export const SET_VIDEO_PLAYER = 'VIDEO/SET_PLAYER';
export const setVideoPlayer = ref => ({
	type: SET_VIDEO_PLAYER,
	ref
});
