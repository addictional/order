import {observer, store} from "../../store";
import actions from "../all-actions";
import {Delivery} from "../../core/main";
import Component from '../../core/components';
import template from './templates/main.html';
import preloader from './templates/preloader.html';


class DeliveryMethods extends  Component {
    constructor() {
        super('#available-types',template,preloader);
    }

    setEvents(callback) {
        let inputArr  = document.querySelectorAll('input[name="delivery-method"]');
        for(let i = 0;i<inputArr.length;i++)
        {
            inputArr[i].addEventListener('click',async (e)=>{
                store.dispatch(actions.removeToDoorBlock());
                store.dispatch(actions.removeDeliveryInfo());
                store.dispatch(actions.removeParcelButton());
                store.dispatch(actions.hidePaymentMethodsBlock());
                e.target.checked = true;
                Delivery.method = e.target.value;
                store.dispatch(actions.selectDeliveryMethods(e.target.value));
                if(Delivery.method.type == 'TODOOR')
                {
                    let zip = await Delivery.getZip();
                    let  params = {index: zip,...Delivery.method.data};
                    store.dispatch(actions.showToDoorBlock(params));
                    if(Delivery.method)
                        store.dispatch(actions.showAddBonusCardBlock());
                }else if(Delivery.method.type == 'PICKUP')
                {
                    store.dispatch(actions.showParcelButton());
                    store.dispatch(actions.removeAddBonusCardBlock());
                }
            })
        }
    }

    observer(){
        observer.addObserver((state,prevState)=>{
            if(observer.deactivated('deliveryMethods',state))
                this.clear();
            else if(observer.update('deliveryMethods',state))
                this.update(state['deliveryMethods'].data);

        });
    }

    static dataProcessing(data){
        let methods = {
            TODOOR: false,
            PICKUP: false,
            tCheck: false,
            pCheck: false
        };
        for(let type in data)
        {
            if(type != 'geo')
                methods[type] = true;
        }
        return methods;
    }

    static SetDefaultSelector(data){
        let methods = {
            ...data
        };
        if(Delivery.method.type == null) {
            if (methods.TODOOR)
            {
                Delivery.method = 'TODOOR';
                return 'TODOOR';
            }
            else if (methods.PICKUP)
            {
                Delivery.method = 'PICKUP';
                return 'PICKUP';
            }
            return false;
        }
        return Delivery.method.type;
    }

}

export {DeliveryMethods};