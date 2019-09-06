

class FeatureCollection {
    constructor(){
        this.type = "FeatureCollection";
        this.__features =  [];
    }

    set feature(val){
        this.__features.push(val);
    }

    get features(){
        return {type: this.type,features :  JSON.parse(JSON.stringify(this.__features))};
    }
    get length(){
        return this.__features.length;
    }

    clearFeatures(){
        this.__features = [];
    }
}

const YandexMap = class  {


    /**
     *
     */

    constructor(){
        this.placemarks = {};
        this.currentLocation = [];
        this.geoObjects = new FeatureCollection();
        this.__lastGeo = null;
        this.objectManager = null;
        this.eventHandler = null;
        this.events = [];
        this.geo = null;
    }

    addEventListener(type,callback){
        this.events.push({type: type,func :callback});
    }


    /**
     *
     * @param latitude
     * @param longitude
     */

    init(geo){
        this.geo = JSON.stringify(geo);
        if(typeof this.map == "undefined" || this.map == null)
        {
            console.log('init map');
            this.map = new ymaps.Map("pvzmap", {
                center: geo,
                zoom: 11,
                controls: ['searchControl', 'zoomControl', 'typeSelector']
            });
            this.currentLocation = geo;
            this.eventHandler = this.map.events.group();
            this.events.forEach((callback)=>{
                this.eventHandler.add(callback.type,callback.func)
            });
        }
        else
            this.map.setCenter(geo);
    }

    /**
     *
     */
    clearMap(){
            if(this._cluster != null){
                // this.map.geoObjects.remove(this._cluster);
                // this.objectManager = null;
            }
            this.geoObjects.clearFeatures();
    }
    setMap(geo,objects)
    {
        this.init(geo);
        this.clearMap();
        for (let ob of objects)
            this.addPlaceMark(ob);
        this.addObjectsToMap();
        this.__lastGeo = this.geo;
    }

    get bounds(){
        return this.map.getBounds();
    }


    /**
     *
     * @param {Parcel}
     */

    addPlaceMark(obj) {
        this.placemarks[this.placemarks.length] = obj;
        let i = this.geoObjects.length;
        let img = obj.imgPointer;
        console.log(img);
        let placeMark = {
            type: 'Feature',
            id: i,
            geometry:{
                type: 'Point',
                coordinates: obj.getGeoCoordinates()
            },
            properties: {
                balloonContent: obj.getDescription(),
            },
            options:{
                iconLayout: 'default#image',
                iconImageHref: img.passive.href,
                iconImageSize:  img.passive.size,
                iconOffset: img.passive.offset,
                iconImageHrefActive: img.active.href,
                iconImageSizeActive:  img.active.size,
                iconOffsetActive: img.active.offset,
                iconColor: obj.color,
                hideIconOnBalloonOpen: false,
                balloonMaxWidth: 280,
                hasFitting: obj.hasFitting(),
                cashlessPayment: obj.cashlessPayment()
            }
        };
        this.geoObjects.feature = placeMark;
    }

    addObjectsToMap(){
        let objectManager;
        if(this.objectManager == null)
        {
            objectManager = new ymaps.ObjectManager({
                // clusterize: true,

                preset: 'islands#invertedVioletClusterIcons',

                // clusterBalloonContentLayout: 'cluster#balloonAccordion',
                groupByCoordinates: false,
                // clusterIconLayout: 'default#pieChart',

                // clusterDisableClickZoom: false,
                // clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false
            });
            this.map.geoObjects.add(objectManager);
            this.objectManager = objectManager;
        } else
        {
            objectManager = this.objectManager;
            objectManager.removeAll()
        }
        objectManager.add(this.geoObjects.features);
        objectManager.objects.events.add(['mouseenter', 'mouseleave'], this.onObjectEvent.bind(this));
        // this.eventHandler.removeAll();
        this.setBounds();
    }

    onObjectEvent (e) {
        let objectId = e.get('objectId');
        let options = this.geoObjects.features.features[objectId].options;
        if (e.get('type') == 'mouseenter') {
            // Метод setObjectOptions позволяет задавать опции объекта "на лету".
            this.objectManager.objects.setObjectOptions(objectId, {
                iconLayout: 'default#image',
                iconImageHref: options.iconImageHrefActive,
                iconImageSize:  options.iconImageSizeActive,
                iconOffset: options.iconOffsetActive,
                iconColor: options.iconColor,
                hideIconOnBalloonOpen: false,
                balloonMaxWidth: 280,
                hasFitting: options.hasFitting,
                cashlessPayment: options.cashlessPayment
            });
        } else {
            this.objectManager.objects.setObjectOptions(objectId, {
                iconLayout: 'default#image',
                iconImageHref: options.iconImageHref,
                iconImageSize:  options.iconImageSize,
                iconOffset: options.iconOffset,
                iconColor: options.iconColor,
                hideIconOnBalloonOpen: false,
                balloonMaxWidth: 280,
                hasFitting: options.hasFitting,
                cashlessPayment: options.cashlessPayment
            });
        }
    }

    setBounds(){
        let objectManager = this.objectManager;
        this.map.setBounds(objectManager.getBounds(), {
            checkZoomRange: true
        }).then(()=>{
            if(this.map.getZoom()==0)
            {
                this.map.setZoom(10);
                this.map.setBounds(objectManager.getBounds(), {
                    checkZoomRange: true
                });
            }
        });
    }




    /**
     *
     * @param coordinates [latitude,longitude]
     */

    moveToPlacemark(coordinates)
    {
        let _this = this;
        this.map.setZoom(18);
        return new Promise((resolve,reject)=>{
            this.map.panTo([coordinates])
                .then(()=>{
                    _this.currentLocation = coordinates;
                    resolve(true);
                })
                .catch((error)=>{
                    reject(error);
                })
        });
    }

    dispatchFilter(state){
        this.objectManager.setFilter((obj)=>{
            if(state.cashless && state.fitting){
                if(obj.options.cashlessPayment && obj.options.hasFitting)
                    return true;
                else
                    return false;
            }
            if(obj.options.cashlessPayment && state.cashless)
                return true;
            else if(obj.options.hasFitting && state.fitting)
                return true;
            else if(!state.cashless && !state.fitting)
                return true;
            else
                return false;
        });
    }


}
export {YandexMap};