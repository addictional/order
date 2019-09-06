import User from './entities/user';
import {store,observer} from "../store";
import {Delivery} from "./entities/delivery";
import Order from "./entities/order";
import {FirstStepBlock} from "../components/first.step/component";
import {DeliveryMethods} from "../components/delivery.methods/component";
import {PriceBlock} from "../components/price.block/component";
import {BonusCardBlock} from "../components/bonuscard.block/component";
import {AddBonusCardBlock} from "../components/add.bonus.card/component";
import {ToDoorMethod} from "../components/todoor.method/component";
import {ParcelMethodBlock} from "../components/parcel_shop.method/component";
import {DeliveryInfo} from "../components/delivery.info/component";
import {PaymentMethodsBlock} from "../components/payment.methods.block/component";
import OrderIsProcessed from "../components/order.is.processed/component";
import CommentBlock from "../components/comment/component";

import actions from "../components/all-actions"

import Utils from './utils';
const isEmpty = Utils.empty;

const App = {
    params: {
      mobile: false,
      ajaxUrl: '/rest.v2/ajax.order/?'+document.querySelector('[name="bitrix-session-id"]').value
    },
    async ready(){
        let data = await $.ajax({
            url: this.params.ajaxUrl,
            data: {method: 'init'},
            dataType: 'json'
        });
        this.params.mobile = window.innerWidth <= 991;
        User.init({
            user: {...data.user},
            bonusCard:{
                number: data.bonusCard
            }
        });
        if(User.bonusCardExist())
        {
            let number = User.getBonusCardInfo().number;
            let data = await $.ajax({
                url: this.params.ajaxUrl,
                data: {
                    method: 'bonusCardStatus',
                    bonusCard: User.getBonusCardInfo().number,
                },
                dataType: 'json'
            });
            User.init({
                bonusCard: {
                    available: data.BNS_AVAILABLE,
                    status: data.STATUS,
                    maxChequePoints : data.maxChequePoints,
                    preCalculatedBns: data.preCalculatedBns,
                    number: number
                }
            });
        }
        Order.init(data);
        let data2 = await $.ajax({
            url: '/local/components/weblooter/new_order/templates/.default/build/template.htm',
            dataType: 'html'});

        Delivery.init();

        new FirstStepBlock();
        new DeliveryMethods();
        new PriceBlock();
        new BonusCardBlock();
        new AddBonusCardBlock();
        new ToDoorMethod();
        new ParcelMethodBlock();
        new DeliveryInfo();
        new PaymentMethodsBlock();
        new OrderIsProcessed();
        new CommentBlock();

        let button = document.querySelector('.wbl-finish-make-order-block');

        button.addEventListener('click',async ()=>{
            document.querySelector('.main-loader-wrap').classList.remove('hide');
            let d = {
                method: 'add',
                delivery: {
                    city: Delivery.city,
                    zone: Delivery.method.zone,
                    paymentMethod: Order.paymentMethod,
                    cost:Delivery.price,
                    threshold:Delivery.threshold,
                    bonusCard:User.bonusCardExist() ? User.getBonusCardInfo().number : '',
                    bonusPointsUsed: Order.bonusPointsUsed,
                    method: Delivery.method.type,
                    regionCode: '1',
                    shippingDate:Delivery.method.shippingDate,
                    estimatedDeliveryDate:Delivery.method.estimatedDeliveryDate,
                    methodData: {
                        ...Delivery.method.info
                    }
                },
                user:{
                    phone:User.phone,
                    email:User.email,
                    name:User.name,
                    comment: Order.comment,
                    addCard: Order.addCard,
                    time: (new Date()).toISOString(),
                }};
                let data =  await  $.ajax({
                    url: App.params.ajaxUrl,
                    method: "POST",
                    data: d,
                    dataType: 'json'
                });
                if(data.status == "error")
                {
                    document.querySelector('.main-loader-wrap').classList.add('hide');
                    if(data.error == "Вы указали некорректный e-mail.")
                        store.dispatch(actions.addError());
                }else
                    store.dispatch(actions.showOrderIsProcessed(data));
        });
        observer.addObserver((c,p)=>{
            console.log(JSON.parse(JSON.stringify(c)));
            if(!isEmpty(User.name) && !isEmpty(User.email) && !isEmpty(User.phone) && Delivery.method.ready
                && Order.paymentMethod)
                button.classList.remove('hide');
            else if (!button.classList.contains('hide'))
                button.classList.add('hide');
        });

        observer.init();
        return true;
    }
};

export  {App,User,store,observer,Delivery,Order};