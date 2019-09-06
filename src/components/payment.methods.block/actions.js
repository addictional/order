import {createActions} from 'redux-actions';

const actions = createActions({
    showPaymentMethodsBlock : payload=>payload,
    selectPaymentMethodsBlock : payload => payload,
    hidePaymentMethodsBlock : null
});

export default actions