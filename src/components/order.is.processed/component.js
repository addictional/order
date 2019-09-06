import Component from "../../core/components";
import template from "./template.html";
import {observer} from "../../store";
import {User} from "../../core/main";

class OrderIsProcessed extends Component{
    constructor() {
        super('.container-fluid.wbl-make-order-wrapper', template);
        this.images = [];
        this.ready = false;
    }


    static preloaderHeightAndWidth(MAX_WIDTH){
        let width = 1350, height = 1800;
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
        return `width: ${width}px; height: ${height}px;`;
    }

    static date(obj){
        let date , time;
        const format = (num)=>{
            return (num < 10) ? `0${num}` : num;
        }
        date  = `${format(obj.getDate())}.${format(obj.getMonth()+1)}.${obj.getFullYear()}`;
        time = `${format(obj.getHours())}:${format(obj.getMinutes())}:${format(obj.getSeconds())}`;
        return `${date} ${time}`;
    }
    prepareParams() {
        let items = this.params.order.items,
            order = this.params.order,
            dateString = OrderIsProcessed.date(new Date(order.date)),
            index = 0;
        const onload = (index,recursion = true,interval = null,)=>{
            if(this.ready)
            {
                let element = document.querySelector(`[data-item-image="${index}"]`);
                element.parentElement.classList.remove('image-loader-border');
                if(interval != null)
                    clearInterval(interval);

                element.innerHTML = "";
                element.appendChild(this.images[index])

            }
            else if(recursion == true){
                let interval = setInterval(()=>{
                    onload(index,false,interval);
                },5);
            }
        };

        order.date = dateString;
        order.price = order.basePrice - order.discount;
        order.totalPrice = order.price + order.delivery;

        for(let item of items){
            item.totalPrice = item.basePrice - item.discount;
        }
        this.images = items.map((item)=>{
            let img = new Image();
            let i  = index++;
            img.src = item.img;
            item.img = i;
            img.onload = ()=>{
                onload(i);
            };
            return img;
        });
        this.params.userAuthorized = User.isAuthorized();
        this.params = {...this.params,name: User.name,phone: User.phone,email: User.email,items: items};
        console.log(this.params);
    }

    afterUpdate() {

        document.querySelectorAll('.wbl-basket-item-img.image-loader-border').forEach((element)=>{
            element.style =  OrderIsProcessed.preloaderHeightAndWidth(element.clientWidth);
        });
        document.querySelector('.main-loader-wrap').classList.add('hide');
        this.ready = true;
    }

    observer() {
        observer.addObserver((state,prevState)=>{
            let s = state['orderIsProcessed'];
            if(observer.deactivated('orderIsProcessed',state))
                this.clear();
            else if(s.visibility && !prevState['orderIsProcessed'].visibility)
                this.update(s.data);
        });
    }
}

export default OrderIsProcessed;