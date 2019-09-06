import {handleActions} from "redux-actions";
import {App} from '../../core/main'
import actions from './actions';

const setElementVisibility =  function(state,elements = []){
    return elements.map((element)=>{
        if(element.inBounds){
            if(state.cashless && state.fitting){
                if(element.cashlessPayment && element.hasFitting)
                    element.visibility = true;
                else
                    element.visibility = false;
            }
            else if(element.cashlessPayment && state.cashless)
                element.visibility = true;
            else if(element.hasFitting && state.fitting)
                element.visibility = true;
            else if(!state.cashless && !state.fitting)
                element.visibility = true;
            else
                element.visibility = false;
        } else
            element.visibility = false;
        return element;
    });
};


const reducer = handleActions(
    new Map([
        [
            actions.showParcelButton,
            (state)=>{
                console.log('SHOW_PARCEL_BUTTON');
                state.visibility.button  = true;
                return state;
            }
        ],
        [
            actions.removeParcelButton,
            (state)=>{
                console.log('REMOVE_PARCEL_BUTTON');
                state.visibility.button = false;
                state.visibility.selectedParcelShopArea = false;
                state.selected = false;
                return state;
            }
        ],
        [
            actions.showMapPopup,
            (state,action)=>{
                console.log('SHOW_MAP_POPUP');
                state.filter = {
                    cashless : false,
                    fitting : false
                };
                state.selected = false;
                if(App.params.mobile)
                {
                    state.mobile = {
                        show: 'list',
                        visibility : {
                            filter: false,
                            switcher: true
                        }
                    };
                }
                state.parcels = setElementVisibility(state.filter,action.payload);
                state.visibility.selectedParcelShopArea = false;
                state.visibility.map = true;
                return state;
            }
        ],
        [
            actions.removeMapPopup,
            (state,action)=>{
                console.log('REMOVE_MAP_POPUP');
                state.parcels= null;
                state.visibility.map = false;
                return state;
            }
        ],
        [
            actions.selectParcel,
            (state,action)=>{
                console.log('SELECT_PARCEL');
                state.selected = true;
                state.visibility.selectedParcelShopArea = true;
                return state;
            }
        ],
        [
            actions.setMapFilter,
            (state,action)=>{
                console.log('SET_MAP_FILTER');
                for(let index in state.filter)
                    if(index == action.payload)
                        state.filter[index] = !state.filter[index];
                state.parcels = setElementVisibility(state.filter,state.parcels);
                return state;
            }
        ],
        [
            actions.switchMapModeMobile,
            (state,action)=>{
                console.log('SWITCH_MAP_MODE_MOBILE');
                state.mobile.show = action.payload;
                return state;
            }
        ],
        [
            actions.mapBoundsChanged,
            (state,action)=>{
                let bounds = action.payload;
                console.log('MAP_BOUNDS_CHANGED');
                state.parcels.forEach((elem)=>{
                    elem
                    if ((bounds[0][0] < elem.geo[0])
                        && (bounds[1][0] > elem.geo[0])
                        && (bounds[0][1] < elem.geo[1])
                        && (bounds[1][1] > elem.geo[1]))
                    {
                        elem.inBounds = true;
                    }else{
                        elem.inBounds = false;
                    }
                });
                state.bounds = bounds;
                state.parcels = setElementVisibility(state.filter,state.parcels);
                return state;
            }
        ],

        [
            actions.mapFilterMobile,
            (state)=>{
                console.log('SWITCH_MAP_MODE_MOBILE');
                state.mobile.visibility.filter = !state.mobile.visibility.filter;
                state.mobile.visibility.switcher = !state.mobile.visibility.switcher;
                return state;
            }
        ],
    ]),
    {
        visibility: {
            map: false,
            button: false,
            selectedParcelShopArea: false
        },
        selected:false,
        filter: {
            cashless : false,
            fitting : false
        },
        mobile:{
            show: '',
            visibility: {
                filter: true,
                switcher: true
            }
        },
        parcels: null,
        bounds: [[0,0],[0,0]]
    }
);

export {reducer};