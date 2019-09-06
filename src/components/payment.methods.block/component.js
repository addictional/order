import Component from "../../core/components";
import {Order,Delivery} from '../../core/main';
import {observer,store} from "../../store";
import {reducer as paymentMethodBlock} from "./reducer";
import actions from '../all-actions'
import template from './template.html';

class PaymentMethodsBlock extends Component {
    constructor() {
        super('#payment-methods',template);

    }

    observer(){
        observer.addObserver((state,prevState)=>{
            if(observer.deactivated('paymentMethodBlock',state))
                this.clear();
            else if(observer.update('paymentMethodBlock',state))
            {
                this.update(state.paymentMethodBlock.data);
            }
        });
    }

    static defaultSelect(data = null){
        let result;
        if(data == null || typeof data == 'undefined')
        {
            setTimeout(()=>{
                console.log(data);
            },3000);
            throw new  Error('default selecting payment failed. data == null');
        }
        for (let temp  of data)
        {
            if(temp.value == '13')
            {
                result =  temp.value;
                break;
            }
            result = temp;
        }
        return result.value;
    }
    setEvents() {
        let elements = this.element.querySelectorAll('input[type=radio]');
        for( let el of elements){
            el.addEventListener('click',(e)=>{
                Order.paymentMethod = e.target.value;
                store.dispatch(actions.selectPaymentMethodsBlock(e.target.value));
            })
        }
    }
}

export {PaymentMethodsBlock}