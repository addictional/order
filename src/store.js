import  {createStore,combineReducers} from 'redux';
import Observer from './core/observer';
import  {reducer as firstStep} from './components/first.step/reducer';
import  {reducer as deliveryMethods} from './components/delivery.methods/reducer';
import  {reducer as priceBlock} from './components/price.block/reducer';
import  {reducer as bonusCardBlock} from './components/bonuscard.block/reducer';
import  {reducer as addBonusCardBlock} from './components/add.bonus.card/reducer';
import  {reducer as toDoorMethod} from './components/todoor.method/reducer';
import {reducer as parcelMethod} from './components/parcel_shop.method/reducer';
import {reducer as deliveryInfo} from './components/delivery.info/reducer';
import {reducer as paymentMethodBlock} from './components/payment.methods.block/reducer';
import {reducer as orderIsProcessed} from './components/order.is.processed/reducer';
import {reducer as commentBlock} from './components/comment/reducer';
let reducer  = combineReducers({
    firstStep,
    deliveryMethods,
    priceBlock,
    bonusCardBlock,
    addBonusCardBlock,
    toDoorMethod,
    parcelMethod,
    deliveryInfo,
    paymentMethodBlock,
    orderIsProcessed,
    commentBlock
});

const store = createStore(reducer);

const observer =  new Observer();
export {store,observer};

