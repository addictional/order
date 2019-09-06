import {Delivery} from "../main";

const Order = {
    init(data){
        this.bonusPointsUsed = 0;
        this._delivery = 0;
        this.discount = data.discount;
        this.basePrice = data.totalPrice;
        this.paymentMethod = false;
        this.addCard = false;
        this.comment = "";
        return true;
    },

    addCard(){
        this.addCard = !this.addCard;
    },

    get delivery(){
        let price  = this.basePrice-this.discount;
        if(price >= Delivery.threshold)
            return 0;
        return Delivery.price;
    },

    get totalPrice(){
        let price  = this.basePrice-this.discount;
        return price-this.bonusPointsUsed+this.delivery;
    }

}

export default Order;