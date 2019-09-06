import {handleActions} from "redux-actions";
import {User,Delivery} from '../../core/main'
import actions from './actions';

const reducer = handleActions(
    new Map([
        [
            actions.commentBlockShow,
            (state,action)=>{
                console.log('COMMENT_BLOCK_SHOW');
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.commentBlockRemove,
            (state)=>{
                console.log('COMMENT_BLOCK_REMOVE');
                state.visibility = false;
                return state;
            }
        ],
        [
            actions.addComment,
            (state,action)=>{
                console.log('ADD_COMMENT');
                state.comment = action.payload;
                return state;
            }
        ]
    ]),
    {
        visibility: false,
        comment: ''
    }
);

export {reducer};