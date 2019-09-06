import {createActions} from 'redux-actions';

const actions = createActions({
    showToDoorBlock: payload=>payload,
    removeToDoorBlock: null,
    updateToDoorBlock: payload=>payload,
    removeStreet: payload=>{
        return {index: payload};
    },
});

export default actions;