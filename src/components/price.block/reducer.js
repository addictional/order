import actions from './actions';
import {handleActions} from "redux-actions";
import {Delivery, Order} from '../../core/main'

const reducer = handleActions(
    new Map([
        [
            actions.initPriceBlock,
            (state,action)=>{
                console.log('PRICE_BLOCK_INIT');
                state.data ={
                    basePrice: Order.basePrice,
                    delivery: Order.delivery,
                    bonusPoints: Order.bonusPointsUsed,
                    discount: Order.discount,
                    finalPrice: Order.totalPrice,
                    preCalculatedBns: false
                };
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.updatePriceBlock,
            (state,action)=>{
                console.log('PRICE_BLOCK_UPDATE');
                state.data = {...state.data,...action.payload};
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.removePriceBlock,
            (state,action)=>{
                console.log('PRICE_BLOCK_REMOVE');
                state.data = {...action.payload};
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.showPayButton,
            (state,action)=>{
                console.log('PRICE_BLOCK_SHOW_PAY_BUTTON');
                state.data = {...action.payload};
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.removePayButton,
            (state,action)=>{
                console.log('PRICE_BLOCK_REMOVE_PAY_BUTTON');
                state.data = {...action.payload};
                state.visibility = true;
                return state;
            }
        ],
    ]),
    {
        visibility : false,
        data : {
            basePrice: 0,
            delivery: 0,
            bonusPoints: false,
            discount: 0,
            finalPrice: 0,
            preCalculatedBns: false
        }
    }
);

export {reducer};