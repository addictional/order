import Component from "../../core/components";
import {observer, store} from "../../store";
import actions from "../all-actions";
import { User,Order} from "../../core/main";
import template from './template.html';

import Utils from '../../core/utils';



class AddBonusCardBlock extends Component {
    constructor() {
        super('#add-bonus-card', template);
    }

    setEvents(callback) {
        let button  = document.querySelector('[name="i-want-to-get-a-bonus-card"]');
        if(!Utils.empty(button))
        {
            button.addEventListener('click',()=>{
                console.log('t');
                Order.addCard();
            });
        }
    }


    observer(){
        observer.addObserver((state,prevState)=>{
            let s = state['addBonusCardBlock'];
            if(!User.bonusCardExist())
            {
                if(observer.deactivated('addBonusCardBlock',state))
                    this.clear();
                else if(s.visibility && !prevState['addBonusCardBlock'].visibility)
                    this.update(s.data);
            }
        });
    }

    prepareParams() {
        this.params.show =  User.isAuthorized();
    }
}

export {AddBonusCardBlock};