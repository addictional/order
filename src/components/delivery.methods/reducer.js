import {handleActions} from "redux-actions";
import actions from './actions';

const reducer = handleActions(
    new Map([
        [
            actions.showDeliveryMethods,
            (state,action)=>{
                console.log('DELIVERY_METHODS_SHOW');
                state.data = { ...state.data ,...action.payload};
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.removeDeliveryMethods,
            (state,action)=>{
                console.log('DELIVERY_METHODS_REMOVE');
                state.data = {};
                state.visibility = false;
                return state;
            }
        ],
        [
            actions.showLoaderDeliveryMethods,
            (state)=>{
                console.log('DELIVERY_METHODS_SHOW_LOADER');
                state.data = {init:true};
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.removeLoaderDeliveryMethods,
            (state,action)=>{
                console.log('DELIVERY_METHODS_REMOVE_LOADER');
                state.data = {init:false};
                state.visibility = false;
                return state;
            }
        ],
        [
            actions.selectDeliveryMethods,
            (state,action)=>{
                console.log('DELIVERY_METHODS_SELECT');
                state.data.selectedMethod = action.payload;
                state.data = {...state.data,tCheck: action.payload=='TODOOR', pCheck: action.payload=='PICKUP'};
                state.visibility = true;
                return state;
            }
        ],
    ]),
    {
        visibility: false,
        data: {

        }
    }
);

export {reducer};