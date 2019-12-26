import { combineReducers } from 'redux';
// import {
    
// } from '../actions';
const SET_ANSWER = 'SET_ANSWER';




export const answers = (state = {}, action) => {
	switch (action.type) {
		case SET_ANSWER:
            const { question, value } = action; 
            const toSet = { [question]: {}};
            let newValue = '';
            if ( question == 1) {
                newValue = { ...state[question], value: { ...state[question].value, ...value } };

            } else {
                let finalVal = value;
                if (question == '2') {
                    finalVal = Number(value);
                }
                newValue = { ...state[question], value: finalVal };
            }

            // toSet[question] = { ...currentQuestion, ...value };
            const newState = { ...state };
            newState[question] = newValue;
            if (newState['1'].correct !== true && /n/i.test(newState['1'].value['1']) 
                && /a/i.test(newState['1'].value['2'])) {
                // if (value.letter == 1 && value.value.test(/na/i)) {
                    newState[question].correct = true;
                // }
            }
            if (newState['2'].correct !== true && newState['2'].value == 2) {
                newState['2'].value = Number(newState['2'].value);
                newState['2'].correct = true;
            }
			return newState;
		// case GET_CONSTRAINTS:
		//     return { ...state, created: true, conn: action.conn };
		default:
			return state;
	}
};
export const TiffanyActions = {
    SET_ANSWER,
    setAnswer: (question, answer) => ({
        type: SET_ANSWER,
        question,
        value: answer
    })
};
const callReducer = combineReducers({
	answers
});
export default callReducer;
