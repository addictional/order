const Mustache  = require('mustache');


class Component
{
    constructor(selector,template,preload = '')
    {
        this.params = {};
        this.template = {
            main: template,
            preload: preload
        };
        this.element = document.querySelector(selector);
        this.callbacks = [];
        this.observer();
    }

    render(template,params){
        return Mustache.render(template, params);
    };

    update(params = {})
    {
        params.notAssign = true;
        if(params.notAssign){
            this.params = params;
            delete (this.params.notAssign);
        }
        else
            this.params = Object.assign(this.params,params);
        this.prepareParams();
        let text = this.render(this.template[(this.params.init ? 'preload' : 'main')],this.params);
        this.embed(text);
        for(let i = 0;i<this.callbacks.length;i++)
        {
            this.callbacks[i]();
        }
        this.setEvents();
        this.afterUpdate();
    }

    afterUpdate(){
        // implement as needed
    }

    embed(text){
        this.element.innerHTML = text;
    }

    setEvents()
    {
        // implement as needed
    }

    prepareParams()
    {
        // implement as needed
    }

    hide(){
        this.element.style.display = 'none';
    }

    clear(){
        this.element.innerHTML = '';
    }

    showLoader(){

    }

    observer(){

    }

}

export default Component;