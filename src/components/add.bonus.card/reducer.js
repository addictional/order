import {handleActions} from "redux-actions";
import actions from './actions';

const reducer = handleActions(
    new Map([
        [
            actions.showAddBonusCardBlock,
            (state)=>{
                console.log('ADD_BONUS_CARD_BLOCK_SHOW');
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.removeAddBonusCardBlock,
            (state)=>{
                console.log('ADD_BONUS_CARD_BLOCK_REMOVE');
                state.data = {};
                state.visibility = false;
                return state;
            }
        ],
        [
            actions.selectAddBonusCardBlock,
            (state,action)=>{
                console.log('ADD_BONUS_CARD_BLOCK_SELECT');
                state.data = {...state.data,...action.payload};
                state.visibility = true;
                return state;
            }
        ],
    ]),
    {
        visibility: false,
        data: {

        }
    }
);

export {reducer};