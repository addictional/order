import Component from '../../core/components'
import {observer} from "../../store";
import template from './template.html';

class DeliveryInfo extends Component
{
    constructor()
    {
        super('#delivery-info-message-wrapper',template);
    }


    observer(){
        observer.addObserver((state,prevState)=>{
            if(observer.deactivated('deliveryInfo',state))
                this.clear();
            else if(observer.update('deliveryInfo',state))
                this.update(state.deliveryInfo.data);
        });
    }
}

export {DeliveryInfo};