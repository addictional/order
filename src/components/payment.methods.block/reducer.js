import {handleActions} from "redux-actions";
import {Order} from '../../core/main'
import actions from './actions';

const reducer = handleActions(
    new Map([
        [
            actions.showPaymentMethodsBlock,
            (state,action)=>{
                console.log('SHOW_PAYMENT_METHODS_BLOCK');
                console.log(state,action);
                state.data = action.payload;
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.selectPaymentMethodsBlock,
            (state,action)=>{
                console.log('SELECT_PAYMENT_METHODS_BLOCK');
                for(let el of state.data.methods)
                {
                    if(el.value == action.payload)
                        el.selected = true;
                    else
                        el.selected = false;
                }
                return state;
            }
        ],
        [
            actions.hidePaymentMethodsBlock,
            (state)=>{
                console.log('HIDE_PAYMENT_METHODS_BLOCK');
                state.data = {};
                Order.paymentMethod = false;
                state.visibility = false;
                return state;
            }
        ],
    ]),
    {
        visibility: false,
        data: {}
    }
);

export {reducer};
