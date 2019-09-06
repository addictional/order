import {createActions} from 'redux-actions';

const actions = createActions({
    showParcelButton: null,
    removeParcelButton: null,
    showMapPopup: payload => payload,
    removeMapPopup: null,
    selectParcel: payload=>payload,
    setMapFilter: payload=>payload,
    switchMapModeMobile: payload=>payload,
    mapFilterMobile: null,
    mapBoundsChanged: payload=>payload
});

export default actions;