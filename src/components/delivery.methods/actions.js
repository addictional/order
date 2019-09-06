import {createActions} from 'redux-actions';

const actions = createActions({
    showDeliveryMethods: payload=>payload,
    removeDeliveryMethods: null,
    showLoaderDeliveryMethods:null,
    removeLoaderDeliveryMethods:null,
    selectDeliveryMethods: payload => payload,
});

export default actions;