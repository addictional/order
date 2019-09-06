
import {store} from '../store'
import Utils from './utils';
const isEmpty = Utils.empty;


class Observer {
    constructor(){
        let state = store.getState();
        this.prevState = Utils.unsetLink(state);
        this.callbacks = [];
    }

    deactivated(componentName,state){
        return (!state[componentName].visibility && this.prevState[componentName].visibility);
    };

    update(name,state){
        if(!state[name].visibility)
            return false;
        let bool = this.prevState[name].visibility !== state[name].visibility;
        if(!bool)
            bool = (isEmpty(state[name].data) && !isEmpty(this.prevState[name].data))||
                (!isEmpty(state[name].data) && isEmpty(this.prevState[name].data));

        if(!bool)
            for(let index in state[name].data) {
                if (this.prevState[name].data[index] != state[name].data[index])
                    bool = true;
            }
        return bool;
    };

    addObserver(callback){
        this.callbacks.push(callback);
    }

    main(s,p){

    }

    init(){
        store.subscribe(()=>{
            let state = store.getState();
            this.main(state,this.prevState);
            // console.log(state);
            for(let c  of this.callbacks)
                c(state,this.prevState);
            this.prevState = Utils.unsetLink(state);
        });
    }
}
export default Observer