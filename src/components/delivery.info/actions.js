import {createActions} from 'redux-actions';

const actions = createActions({
    showDeliveryInfo: payload=>payload,
    removeDeliveryInfo: null,
});

export default actions;