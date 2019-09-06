import Utils from '../../core/utils';
import {Order,User} from '../../core/main'
import {observer} from "../../store";
import Component from '../../core/components';
import {store} from "../../store";
import actions from "../all-actions";
import template from './template.html';

class BonusCardBlock extends Component{

    constructor()
    {
        super('.wbl-block-second',template);
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
            +" "+Utils.pluralWord(this.params.BNS_AVAILABLE,"балл","балла","баллов")
        this.params.STATUS = this.status;
    }

    setEvents() {
        this.rangeSlider()
    }

    observer() {
        observer.addObserver((state,prevState)=>{
            let componentState = state.bonusCardBlock;
            if(componentState.visibility && !prevState.bonusCardBlock.visibility)
                this.update(componentState.data);
        });
    }

    rangeSlider()
    {
        let _this = this;
        $("#wbl-range").ionRangeSlider({
            min: 0,
            max: User.getBonusCardInfo().maxChequePoints,
            from: 0,
            onChange: function (data) {
                Order.bonusPointsUsed = data.from;
                store.dispatch(actions.selectBonusCardBlock({bonusPointsUsed: Order.bonusPointsUsed }));
                store.dispatch(actions.updatePriceBlock({bonusPoints: data.from,finalPrice: Order.totalPrice}));
                document.querySelector('.wbl-range-input').value = Order.bonusPointsUsed;
            },
        });
        let rangeSlider = $("#wbl-range").data("ionRangeSlider");
        document.querySelector(".wbl-range-input").addEventListener("keypress",(e)=>{
            if(e.charCode >= 48 && e.charCode <= 57)
            {
                let val = parseInt(e.target.value.toString()+e.key.toString());
                if(val>parseInt(User.getBonusCardInfo().maxChequePoints))
                    e.preventDefault();
            }
            else
                e.preventDefault()
        });
        document.querySelector(".wbl-range-input").addEventListener("keyup",(e)=>{
            Order.bonusPointsUsed = e.target.value;
            store.dispatch(actions.selectBonusCardBlock({bonusPointsUsed: Order.bonusPointsUsed }));
            store.dispatch(actions.updatePriceBlock({bonusPoints:  Order.bonusPointsUsed,finalPrice: Order.totalPrice}));
            rangeSlider.update({from: Order.bonusPointsUsed});
        });
    }
}

export {BonusCardBlock}