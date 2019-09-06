import {handleActions} from "redux-actions";
import actions from './actions';

const reducer = handleActions(
    new Map([
        [
            actions.showOrderIsProcessed,
            (state,action)=>{
                console.log('SHOW_ORDER_IS_PROCESSED');
                state.data = action.payload;
                state.visibility = true;
                return state;
            }
        ]
    ]),
    {
        visibility: false,
        data: {}
    }
);

export {reducer};