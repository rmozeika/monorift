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
