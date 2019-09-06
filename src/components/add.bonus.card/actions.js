import {createActions} from 'redux-actions';

const actions = createActions({
    showAddBonusCardBlock: null,
    removeAddBonusCardBlock: null,
    selectAddBonusCardBlock: payload => payload,
});

export default actions;