import {handleActions} from "redux-actions";
import {Delivery} from '../../core/main'
import actions from './actions';
import Utils from '../../core/utils';
const isEmpty = Utils.empty;

const reducer = handleActions(
    new Map([
        [
            actions.showToDoorBlock,
            (state,action)=>{
                console.log('TO_DOOR_BLOCK_SHOW');
                state.data = {...action.payload};
                state.data.error = isEmpty(state.data.flat);
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.removeToDoorBlock,
            (state,action)=>{
                console.log('TO_DOOR_BLOCK_REMOVE');
                state.data = {zip: action.payload};
                state.visibility = false;
                return state;
            }
        ],
        [
            actions.updateToDoorBlock,
            (state,action)=>{
                console.log('TO_DOOR_BLOCK_UPDATE');
                state.data = {...state.data,...action.payload };
                state.data.error = isEmpty(state.data.flat);
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.removeStreet,
            (state,action)=>{
                console.log('TO_DOOR_BLOCK_STREET_REMOVE');
                state.data = {...action.payload,...Delivery.method.data};
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