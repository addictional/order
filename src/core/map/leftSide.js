class LeftSide {
    constructor(){
        this.container = document.querySelector('.placemark-layer');
        this.elements = [];
        this.container.innerHTML = '';
    }

    hide(){
        this.container.classList.add('hide');
    }

    show(){
        this.container.classList.remove('hide');
    }

    clear(){
        for (let i = 0; i < this.elements.length ; i++) {
            this.elements[i].domElement.parentNode.removeChild(this.elements[i].domElement);
        }
        this.elements = [];

    }

    addElement(obj){
        let div = document.createElement('div');
        div.className = 'pvz-list-item';
        div.innerHTML = obj.getDescription();
        this.container.appendChild(div);
        this.elements.push({
            domElement: document.querySelector('.placemark-layer').lastElementChild,
            geo : obj.getGeoCoordinates(),
            hasFitting: obj.hasFitting(),
            cashlessPayment: obj.cashlessPayment(),
        });
        return this.elements[this.elements.length - 1].domElement;
    }

    set(objects) {
        for (obj of objects)
            this.addElement(obj);
    }


    dispatchFilter(state) {
        for (let i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            if(state.cashless && state.fitting){
                if(element.cashlessPayment && element.hasFitting)
                    element.domElement.style.display = "block";
                else
                    element.domElement.style.display = "none";
            }
            else if(element.cashlessPayment && state.cashless)
                element.domElement.style.display = "block";
            else if(element.hasFitting && state.fitting)
                element.domElement.style.display = "block";
            else if(!state.cashless && !state.fitting)
                element.domElement.style.display = "block";
            else
                element.domElement.style.display = "none";
        }
    }

}

export {LeftSide};