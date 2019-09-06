import Component from "../../core/components";
import {observer, store} from "../../store";
import actions from "../all-actions";
import {App, Delivery, Order} from "../../core/main";
import template from './template.html';
import {PaymentMethodsBlock} from "../payment.methods.block/component";

class ToDoorMethod extends Component {
    constructor() {
        super('#delivery-todoor-block',template)
    }

    setEvents() {
        $('#street-input').select2(
            {
                'minimumInputLength': 3,
                tags: true,
                'language': {
                    'errorLoading': function () {
                        return 'Подготавливаем список...'
                    },
                    'searching': function () {
                        return 'Подготавливаем список...'
                    },
                    'inputTooShort': function () {
                        return 'Варианты появятся после ввода 3х первых букв улицы'
                    },
                    'noResults': function () {
                        return 'Такой улицы в базе не найдено'
                    },
                },
                'ajax': {
                    'url': App.params.ajaxUrl,
                    'dataType': 'json',
                    'data': function (params) {
                        if (Delivery.city != '') {
                            return {
                                method: 'getStreetListByCity',
                                q: Delivery.city + ', ' +
                                    params.term
                            }
                        }
                        else {
                            return false
                        }
                    },
                },
                'escapeMarkup': function (markup1) {
                    return markup1
                },
                'templateResult': function (street) {
                    //console.log(street);
                    return street.text
                },
                'templateSelection': function (street) {
                    return street.text;

                },
                'width': '100%',
                'placeholder': 'Улица',
            }
        );
        $('#street-input').on("select2:select",async (e)=>{
            Delivery.method.street = e.params.data.text;
            let data = await Delivery.getZip();
            let params = {index: data,...Delivery.method.data};
            store.dispatch(actions.updateToDoorBlock(params));
            store.dispatch(actions.showDeliveryInfo({
                price: Delivery.price,
                threshold: Delivery.threshold,
                date: Delivery.estimatedDeliveryDate,
                company: Delivery.method.company
            }));
            store.dispatch(actions.commentBlockRemove());

        });
        document.querySelector('#house-input').addEventListener('input',async (e)=> {
            Delivery.method.build = e.target.value;
            let data = await Delivery.getZip();
            let params = {index: data, ...Delivery.method.data};
            store.dispatch(actions.updateToDoorBlock(params));
            store.dispatch(actions.showDeliveryInfo({
                price: Delivery.price,
                threshold: Delivery.threshold,
                date: Delivery.estimatedDate,
                company: Delivery.method.company
            }));
            store.dispatch(actions.initPriceBlock());
            let paymentMethods = Delivery.method.availablePaymentMethods;
            store.dispatch(actions.showPaymentMethodsBlock({methods:paymentMethods}));
            let select = PaymentMethodsBlock.defaultSelect(paymentMethods);
            Order.paymentMethod = select;
            store.dispatch(actions.selectPaymentMethodsBlock(select));
            store.dispatch(actions.commentBlockShow());
        });
        document.querySelector('#corpus-input').addEventListener('input',async (e)=> {
            Delivery.method.block = e.target.value;
            let data = await Delivery.getZip();
            let params = {index: data, ...Delivery.method.data};
            store.dispatch(actions.updateToDoorBlock(params));
        });
        document.querySelector('#flat-input').addEventListener('input',async (e)=> {
            Delivery.method.flat = e.target.value;
            let data = await Delivery.getZip();
            let params = {index: data, ...Delivery.method.data};
            store.dispatch(actions.updateToDoorBlock(params));
        });
        document.querySelector('#street-todoor-clear-button')
            .addEventListener('click',async ()=>{
                Delivery.method.clear();
                let zip = await Delivery.getZip();
                store.dispatch(actions.removeStreet(zip));
                store.dispatch(actions.removeDeliveryInfo());
                store.dispatch(actions.commentBlockRemove());
            })
    }


    observer(){
        observer.addObserver((state,prevState)=>{
            let s = state['toDoorMethod'];
            if(observer.deactivated('toDoorMethod',state))
                this.clear();
            else if(observer.update('toDoorMethod',state))
                this.update(s.data);
        });
    }


    prepareParams() {
        // console.log(this.params);
    }
}

export {ToDoorMethod};