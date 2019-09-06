import Component from "../../core/components";
import {observer, store} from "../../store";
import actions from "../all-actions";
import {Delivery,Order,App} from "../../core/main";
import {YandexMap} from "../../core/map/ymap";
import {LeftSide} from "../../core/map/leftSide";
import {PaymentMethodsBlock} from "../payment.methods.block/component";


class ParcelMethodBlock  {

    constructor() {
        this.map = new YandexMap();
        this.leftBlock = new LeftSide();
        this.selectedPapcelShopArea = document.querySelector('#selected-pvz-text');
        this.buttonSelector = document.querySelector('#pickup-button');
        this.mapSelector = document.querySelector('.wbl-modal-pickup-layer');
        this.fittingSelector = document.querySelector('#modal-filter-fitting');
        this.cashlessSelector  = document.querySelector('#modal-filter-payment-card');
        this.closeMapButton = document.querySelector('#close-map');
        this.inited = false;
        this.setEvents();
        this.observer();
        this.animationActivated = false;
    }
    showParcelShopArea(){
        this.selectedPapcelShopArea.innerHTML = Delivery.method.getDescription();
    }

    hideParcelShopArea(){
        this.selectedPapcelShopArea.innerHTML = '';
    }

    buttonShow() {
        this.buttonSelector.style.display = "block";
    }

    buttonHide() {
        this.buttonSelector.style.display = "none";
    }

    async mapShow(){
        let data = await Delivery.getAvailableTypes();
        this.initMap(data.geo,data.PICKUP);
        this.mapSelector.classList.remove('hide');
        if(!this.inited)
        {
                document.querySelector('.placemark-layer').style.height = this.heightOfLeftBlock();
            this.inited = true;
        }
        return true;
    }

    mapHide(){
        this.mapSelector.classList.add('hide');
    }

    heightOfLeftBlock(){
        let fullHeight, headerHeight;
        if(App.params.mobile)
        {
            fullHeight =  window.innerHeight;
            headerHeight = document.querySelector('.mobile-header').clientHeight;
        }
        else
        {
            fullHeight = document.querySelector('.wbl-modal-pickup').clientHeight;
            headerHeight = document.querySelector('.wbl-modal-pickup .header').clientHeight;
        }
        return `${fullHeight-headerHeight}px`;
    }


    setEvents() {
        let _this = this;

        this.fittingSelector.addEventListener('click',()=>{
            store.dispatch(actions.setMapFilter('fitting'));
        });
        this.cashlessSelector.addEventListener('click',()=>{
            store.dispatch(actions.setMapFilter('cashless'));
        });
        this.buttonSelector.querySelector('.btn.btn-block.btn-back')
            .addEventListener('click',async ()=>{
                let data = await Delivery.getAvailableTypes();
                this.leftBlock.clear();
                for(let parcel of data.PICKUP)
                    _this.addToLeftBlock(parcel);
                let params = _this.leftBlock.elements.map((elem)=>{
                    elem = JSON.parse(JSON.stringify(elem));
                    elem.inBounds = true;
                    delete(elem.domElement);
                    return elem;
                });
                store.dispatch(actions.showMapPopup(params));
            });
        this.closeMapButton.addEventListener('click',()=>{
            store.dispatch(actions.removeMapPopup());
        });
        this.mapSelector.querySelector('#pvzmap').addEventListener('click',async (e)=>{
            if(e.target.className == 'btn wbl-pzb-btn choosPVZ')
            {
                let ready =  await Delivery.setParcelShop(e.target.getAttribute('data-index'));
                store.dispatch(actions.selectParcel({}));
                store.dispatch(actions.removeMapPopup());
                if(ready)
                    store.dispatch(actions.showDeliveryInfo({
                        price: Delivery.price,
                        threshold: Delivery.threshold,
                        date: Delivery.estimatedDate,
                        company: Delivery.method.company
                    }));
                    store.dispatch(actions.initPriceBlock());
                    let paymentMethods = Delivery.method.availablePaymentMethods;
                    store.dispatch(actions.showPaymentMethodsBlock({methods:paymentMethods}));
                    let select = PaymentMethodsBlock.defaultSelect(paymentMethods);
                    Order.paymentMethod = select;
                    store.dispatch(actions.selectPaymentMethodsBlock(select));
                    store.dispatch(actions.commentBlockShow());
            }
        });

        this.map.addEventListener('boundschange', function () {
            let bounds = _this.map.bounds;
            store.dispatch(actions.mapBoundsChanged(bounds));
        });
        if(App.params.mobile)
        {
            document.querySelector('.mobile-header [data-modal-close]').addEventListener('click',(e)=>{
                store.dispatch(actions.removeMapPopup());
            });
            let links = document.querySelectorAll('.switch-mode a');
            for(let link of links)
                link.addEventListener('click',(e)=>{
                    store.dispatch(actions.switchMapModeMobile(e.target.getAttribute('data-switch-mode')));
                });
            links = document.querySelectorAll('.mobile-map-filter a');
            for(let link of links)
                link.addEventListener('click',(e)=>{
                    store.dispatch(actions.setMapFilter(e.target.getAttribute('data-switch-mode')));
                });
            document.querySelector('.mobile-header [data-mobile-config]')
                .addEventListener('click',()=>{
                    store.dispatch(actions.mapFilterMobile());
                });
            document.querySelector('.mobile-filter-close')
                .addEventListener('animationend', (e) => {
                    e.target.classList.add('hide');
                    this.animationActivated = false;
                });
        }
    }

    filterManagement(statement){
        // this.leftBlock.dispatchFilter(statement);
        if(this.map.objectManager != null)
            this.map.dispatchFilter(statement);
    }


    initMap(geo,parcels){
        // this.leftBlock.clear();
        this.map.setMap(geo,parcels);
        // for(let parcel of parcels)
        //     this.addToLeftBlock(parcel);
        // let objectManager = this.map.objectManager;
        // this.map.eventHandler.add('boundschange', function() {
        //     let counter = 0;
        //     Object.entries(objectManager.objects._objectsById).forEach((el)=>{
        //         // console.log(objectManager.getObjectState(el[0]));
        //         if(objectManager.getObjectState(el[0]).isShown)
        //             counter++;
        //     });
        //     // console.log(counter);
        // });
    }

    addToLeftBlock(obj){
        let _this = this;
        let div = this.leftBlock.addElement(obj);
        div.querySelector('.goto').addEventListener('click',function (e) {
            e.preventDefault();
            _this.map.moveToPlacemark(obj.getGeoCoordinates());
            if(App.params.mobile)
                store.dispatch(actions.switchMapModeMobile('map'));
        });
    }

    switchMobilePopup(str){
        let links = document.querySelectorAll('.switch-mode a');
        for(let link of links)
        {
            if(link.getAttribute('data-switch-mode') != str)
                link.classList.remove('active');
            else
                link.classList.add('active');
        }
        if(str == 'map')
            document.querySelector('.placemark-layer').style.display = 'none';
        else
            document.querySelector('.placemark-layer').style.display = 'block';
    }

    mobileFilter(state) {
        for(let name in state)
        {
            let el = document.querySelector(`.mobile-map-filter a[data-switch-mode=${name}]`);
            (state[name] ? el.classList.add('active'): el.classList.remove('active'));
        }
    }

    mobileFilterVisibility(state){
        for(let name  in state)
        {
            switch (name) {
                case 'filter':
                    let filter =document.querySelector('.mobile-map-filter').classList;
                    if(state[name])
                        filter.remove('hide')
                    else
                    {
                        filter.add('hide');
                        this.animationActivated = true;
                        document.querySelector('.mobile-filter-close').classList.remove('hide');
                    }
                    break;
                case 'switcher':
                    let switcher =document.querySelector('.switch-mode').classList;
                    if(state[name]){
                        let interval =  setInterval(()=>{
                            console.log(this.animationActivated);
                            if(!this.animationActivated)
                            {
                                switcher.remove('hide');
                                clearInterval(interval);
                            }
                            console.log(this.animationActivated);
                        },5);
                    }
                    else
                        switcher.add('hide');
                    break;
            }
        }
    }

    observer(){
        observer.addObserver((state,prevState)=>{
            let s = state['parcelMethod'];
            let p  = prevState['parcelMethod'];
            for(let index in s.visibility)
            {
                if(s.visibility[index] != p.visibility[index])
                {
                    if(!s.visibility[index])
                    {
                        switch(index){
                            case 'button':
                                this.buttonHide();
                                break;
                            case 'map':
                                this.mapHide();
                                break;
                            case 'selectedParcelShopArea':
                                this.hideParcelShopArea();
                                break;
                        }
                    }
                    else
                    {
                        switch(index){
                            case 'button':
                                this.buttonShow();
                                break;
                            case 'map':
                                this.mapShow();
                                break;
                            case 'selectedParcelShopArea':
                                this.showParcelShopArea();
                                break;
                        }
                    }
                }
                if(index === 'map' && s.visibility[index])
                {
                    if(JSON.stringify(s.bounds) != JSON.stringify(p.bounds))
                    {
                        console.log('change')
                        this.filterManagement(s.filter);
                    }

                    s.parcels.forEach((element,index)=>{
                        if(p.parcels != null){
                            if(element.visibility != p.parcels[index].visibility)
                            {
                                if(element.visibility)
                                {
                                    this.leftBlock.elements[index].domElement.style.display = "block"
                                }else{
                                    this.leftBlock.elements[index].domElement.style.display = "none"
                                }
                            }
                        }
                    });
                    for(let key in s.filter )
                        if(s.filter[key] !== p.filter[key])
                        {
                            this.filterManagement(s.filter);
                            if(App.params.mobile)
                                this.mobileFilter(s.filter);
                        }
                }
            }
            if(s.mobile.show != p.mobile.show)
                this.switchMobilePopup(s.mobile.show);
            let update = false;
            for(let name in s.mobile.visibility)
                if(s.mobile.visibility[name] != p.mobile.visibility[name])
                    update = true;
            if(update)
            {
                update = false;
                this.mobileFilterVisibility(s.mobile.visibility);
            }
            if(s.selected && !p.selected)
                this.buttonSelector.querySelector('.btn.btn-block.btn-back').innerText = 'Изменить пункт'
            else if(!s.selected && p.selected)
                this.buttonSelector.querySelector('.btn.btn-block.btn-back').innerText = 'Выбрать пункт'
        });
    }

    prepareParams() {
    }
}

export {ParcelMethodBlock};