import Component from '../../core/components'
import {observer} from "../../store";
import template from './templates/main.html';
import mobileTemplate from './templates/mobile.html';
class PriceBlock extends Component
{
    constructor()
    {
        super('.sum-list',template);
    }



    afterUpdate() {
        let collection = document.querySelectorAll('.order-info');
        for (let element of collection)
        {
            element.classList.remove('preload-filler');
            element.classList.remove('preload-filler-height');
        }
    }
    setEvents(callback) {

    }
    update(params) {
        this.template.main = template;
        this.element = document.querySelector('.sum-list');
        super.update(params);
        this.template.main = mobileTemplate;
        console.log(this.template);
        this.element = document.querySelector('.wbl-block-first.wbl-mobile .sum-list');
        super.update(params);
    }

    observer(){
        observer.addObserver((state,prevState)=>{
            if(observer.update('priceBlock',state))
            {
                this.update(state['priceBlock'].data);
            }
        });
    }
}

export {PriceBlock};