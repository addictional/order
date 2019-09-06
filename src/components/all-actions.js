import {default as firstBlock} from './first.step/actions';
import {default as deliveryMethods} from './delivery.methods/actions';
import {default as priceBlock} from './price.block/actions';
import {default as bonusCardBlock} from './bonuscard.block/actions';
import {default as addBonusCardBlock} from './add.bonus.card/actions';
import {default as toDoorMethod} from './todoor.method/actions';
import {default as parcelMethod} from './parcel_shop.method/actions';
import {default as deliveryInfo} from './delivery.info/actions';
import {default as paymentMethodBlock} from './payment.methods.block/actions';
import {default as orderIsProcessed} from './order.is.processed/actions';
import {default as commentBlock} from './comment/actions';

const actions = {
    ...firstBlock,
    ...deliveryMethods,
    ...priceBlock,
    ...bonusCardBlock,
    ...addBonusCardBlock,
    ...toDoorMethod,
    ...parcelMethod,
    ...deliveryInfo,
    ...paymentMethodBlock,
    ...orderIsProcessed,
    ...commentBlock
};

export default actions;