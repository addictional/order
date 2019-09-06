import Component from "../../core/components";
import template from "./template.html";
import {Order} from "../../core/main";
import {observer,store} from "../../store";
import actions from "../all-actions";


class CommentBlock extends Component{
    constructor() {
        super('#comment-block', template);
        this.images = [];
        this.ready = false;
    }




    prepareParams() {
        console.log(this.params);
    }

    setEvents() {
        this.element.querySelector('textarea').addEventListener('input',(e)=>{
            Order.comment = e.target.value;
            store.dispatch(actions.addComment(e.target.value));
        });
    }

    afterUpdate() {
        this.element.querySelector('textarea').value = this.params.comment;
    }

    observer() {
        observer.addObserver((state,prevState)=>{
            let s = state['commentBlock'];
            if(observer.deactivated('commentBlock',state))
                this.clear();
            else if(s.visibility && !prevState['commentBlock'].visibility)
                this.update({comment: s.comment});
        });
    }
}

export default CommentBlock;