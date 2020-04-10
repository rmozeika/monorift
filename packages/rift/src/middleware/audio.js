// import * as Actions from './actions';

const audioMiddleware = store => {
	// const touchTone = new TouchTone();
	return next => action => {
		switch (action.type) {
			//     case PLAY_DTMF_PAIR:
			//         touchTone.play(action.tones);
			//         break;
			default:
				break;
		}
		next(action);
	};
};

export default audioMiddleware;
