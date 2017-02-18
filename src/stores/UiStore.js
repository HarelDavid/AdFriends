import {observable, computed, action, extendObservable, toJS, autorun} from 'mobx';

export default class UiStore {

    isMobile() {
        let mql = window.matchMedia('(max-width: 920px)');
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && mql.matches ) {
            return true;
        }
        return false;
    }

}
