import Component from '../../core/components';
import {App,User,store,observer,Delivery} from '../../core/main';
import actions from "../all-actions";
import IMask from "imask";
import {reducer as firstStep} from "./reducer";
import Utils from '../../core/utils';
const isEmpty = Utils.empty;
import {DeliveryMethods} from "../delivery.methods/component";
import template from "./template.html";

class FirstStepBlock extends Component {
    constructor() {
        super('#first-step', template);
    }

    setEvents(callback) {
        document.querySelector('[name="order-name-input"]').addEventListener('input',(e)=>{
            store.dispatch(actions.nameAdd(e.target.value));
        });
        document.querySelector('[name="order-email-input"]').addEventListener('input',(e)=>{
            store.dispatch(actions.emailAdd(e.target.value));
        });
        let phone = document.querySelector('[name="order-tel-input"]');
        phone.value = User.phone;
        let mask = IMask(phone,{
            mask: '+{7}(000)000-00-00'
        });
        mask.on('accept',()=>{
            store.dispatch(actions.phoneAdd(mask.value));
        });
        this.createInputAutocomplete();
    }

    createInputAutocomplete(){
        let cityInput = $('#city-selector');
        cityInput.select2(
            {
                minimumInputLength: 3,
                language: {
                    errorLoading: function () {
                        return 'Подготавливаем список...'
                    },
                    searching: function () {
                        return 'Подготавливаем список...'
                    },
                    inputTooShort: function () {
                        return 'Варианты появятся после ввода 3х первых букв населенного пункта'
                    },
                    noResults: function () {
                        return 'Такого населенного пункта в базе не найдено'
                    },
                },
                ajax: {
                    url: App.params.ajaxUrl,
                    dataType: 'json',
                    data: function (params) {
                        return {method:'getLocationList',q: params.term}
                    },
                    processResult: function (data) {
                        return {
                            result: data
                        };
                    }

                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                templateResult: function (city) {
                    return city.text;
                },
                templateSelection: function (city) {
                    return city.text;
                },
                width: '100%',
                placeholder: '--Выберите населенный пункт--',
            }
        );
        cityInput.on('select2:select', async function(e) {
            store.dispatch(actions.removeDeliveryMethods());
            store.dispatch(actions.removeToDoorBlock());
            store.dispatch(actions.removeParcelButton());
            store.dispatch(actions.removeAddBonusCardBlock());
            store.dispatch(actions.hidePaymentMethodsBlock());
            store.dispatch(actions.removeDeliveryInfo());
            store.dispatch(actions.commentBlockRemove());
            Delivery.city = e.params.data.text;
            store.dispatch(actions.cityAdd({city : e.params.data.text}));
            store.dispatch(actions.showLoaderDeliveryMethods());
            let data = await Delivery.getAvailableTypes();
            let params = DeliveryMethods.dataProcessing(data);
            store.dispatch(actions.removeLoaderDeliveryMethods());
            store.dispatch(actions.showDeliveryMethods(params));
            store.dispatch(actions.selectDeliveryMethods(DeliveryMethods.SetDefaultSelector(params)));
            if(Delivery.method.type == 'TODOOR')
            {
                let zip = await Delivery.getZip();
                params = {index: zip,...Delivery.method.data};
                store.dispatch(actions.showToDoorBlock(params));
                if(Delivery.method)
                    store.dispatch(actions.showAddBonusCardBlock());
            }else if(Delivery.method.type == 'PICKUP')
            {
                store.dispatch(actions.showParcelButton());
            }

        });
        document.querySelector('#clear-city-selector').addEventListener('click',()=>{
            store.dispatch(actions.cityRemove());
            store.dispatch(actions.removeDeliveryMethods());
            store.dispatch(actions.removeToDoorBlock());
            store.dispatch(actions.removeParcelButton());
            store.dispatch(actions.removeAddBonusCardBlock());
            store.dispatch(actions.removeDeliveryInfo());
            store.dispatch(actions.hidePaymentMethodsBlock());
            store.dispatch(actions.commentBlockRemove());
        })
    }

    observer(){
        observer.addObserver((state,prevState)=>{
            let s = state['firstStep'];
            console.log('error',s.data.emailError != prevState['firstStep'].data.emailError,
                s.data.emailError,prevState['firstStep'].data.emailError);
            if(s.visibility && !prevState['firstStep'].visibility)
                this.update(s.data);
            if(s.data.city == '' && !isEmpty(prevState['firstStep'].data.city))
            {
                this.update(s.data);
            }else if(s.data.emailError != prevState['firstStep'].data.emailError )
            {
                console.log('work',s.data);
                this.update(s.data);
            }
        });
    }
}

export {FirstStepBlock};