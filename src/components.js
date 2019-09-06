import {templates,pluralWord,htmlDecode} from "./functions";
const Mustache  = require('mustache');


class LoaderLayout {
    constructor() {
        this.element = document.querySelector(".loader-layout");
    }

    show() {
        this.element.style.display = "block";
    }

    hide() {
        this.element.style.display = "none";
    }
}

class PvzButton extends LoaderLayout
{
    constructor(){
        super();
        this.element = document.querySelector('#pickup-button');
        this.map = document.querySelector('.wbl-modal-pickup-layer');
    }

    addCallback(callback){
        callback(this.element,this.map);
    }

}

class Component
{
    constructor(selector)
    {
        this.params = {};
        this.template = this.constructor.name;
        this.selector = selector;
        this.callbacks = [];
    }

    render(){
        return Mustache.render(templates[this.template], this.params);
    };

    update(params)
    {
        this.params = Object.assign(this.params,params);
        this.prepareParams();
        let text = this.render();
        text = htmlDecode(text);
        this.embed(text);
        for(let i = 0;i<this.callbacks.length;i++)
        {
            this.callbacks[i]();
        }
    }

    embed(text){
        document.querySelector(this.selector).innerHTML = text;
    }

    addCallback(callback)
    {
        this.callbacks[this.callbacks.length] = callback
    }

    prepareParams()
    {
        // implement as needed
    }

    hide(){
        document.querySelector(this.selector).style.display = 'none';
    }

    clear(){
        document.querySelector(this.selector).innerHTML = '';
    }

}

class OrderInfo extends Component
{
    constructor()
    {
        super('.sum-list');
        this.template = 'OrderInfo';
        this.setDefaultValues();
    }
    prepareParams() {
        if( typeof this.params.Bonuses != "undefined") {
            if(!this.params.Bonuses)
                return;
            if (parseInt(this.params.Bonuses.maxChequePoints) > 0)
                this.params.BonusPointsAvailable = true;
            else
                delete(this.params.BonusPointsAvailable);
            delete(this.params.Bonuses);
        }
    }

    setDefaultValues()
    {
        this.params = {
            TotalPrice : 0,
            Delivery: 0,
            BonusPoints: 0,
            Discount: 0,
            FinalPrice: 0
        };
    }
}

class BonusCardArea extends Component{

    constructor()
    {
        super('.wbl-block-second');
        this.template = 'BonusCardArea';
    }
    
    get status()
    {
        switch (this.params.STATUS) {
            case 'GOLD':
                return 'ЗОЛОТАЯ';
            case 'SILVER':

                return 'СЕРЕБРЯНАЯ';
            case 'BLACK':
                return 'ЧЕРНАЯ'
        }
    }
    prepareParams() {
        this.params.BNS_AVAILABLE = this.params.BNS_AVAILABLE
            +" "+pluralWord(this.params.BNS_AVAILABLE,"балл","балла","баллов")
        this.params.STATUS = this.status;
    }


}

class FirstStep extends Component{

    constructor()
    {
        super('#first-step');
        this.template = 'FirstStep';
    }
}

class DeliveryTypes extends  Component {

    constructor() {
        super('#available-types .block-right');
        this.template = 'DeliveryTypes';
    }

}

class DeliveryToDoor extends Component{

    constructor(){
        super('#delivery-todoor-block')
        this.template = 'DeliveryToDoor';
    }

    prepareParams() {
        for(let index in this.params)
        {
            this.params[index] = (this.params[index] == null? false : this.params[index]);
        }
    }
}


export {
    OrderInfo,
    BonusCardArea,
    FirstStep,
    DeliveryTypes,
    DeliveryToDoor,
    LoaderLayout,
    PvzButton
};