import {handleActions} from "redux-actions";
import {User} from '../../core/main'
import actions from './actions';

const reducer = handleActions(
    new Map([
        [
            actions.initBonusCardBlock,
            (state,action)=>{
                console.log('BONUS_CARD_BLOCK_INIT');
                state.data = {...action.payload};
                state.visibility = true;
                console.log(state.data);
                return state;
            }
        ],
        [
            actions.removeBonusCardBlock,
            (state,action)=>{
                console.log('BONUS_CARD_BLOCK_REMOVE');
                state.data = {};
                state.visibility = false;
                return state;
            }
        ],
        [
            actions.selectBonusCardBlock,
            (state,action)=>{
                console.log('BONUS_CARD_BLOCK_SELECT');
                state.data = {...state.data,...action.payload};
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