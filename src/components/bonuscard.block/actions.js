import {createActions} from 'redux-actions';

const actions = createActions({
    initBonusCardBlock: payload=>payload,
    removeBonusCardBlock: null,
    selectBonusCardBlock: payload => payload,
});

export default actions;

