import {createActions} from 'redux-actions';

const actions = createActions({
    updatePriceBlock: payload=>payload,
    initPriceBlock: payload=>payload,
    removePriceBlock: null,
    showPayButton:null,
    removePayButton:null
});

export default actions