import {createActions} from 'redux-actions';

const actions = createActions({
    commentBlockShow: ()=>{},
    commentBlockRemove: null,
    addComment: payload => payload,
});

export default actions