import CSSModules from 'react-css-modules'
import React, {PropTypes} from 'react';
import {observer} from 'mobx-react';
import Offer from './Offer'
import OfferEntry from './OfferEntry'
import {observable} from 'mobx';
import classname from 'classnames';
import autobind from 'autobind-decorator'
import Modal from '../modal';

import style from './style.scss';
Object.assign(style)


@observer
class Offers extends React.Component {

    @observable
    state = {
        isModalOpen: false
    }


    @autobind
    openOfferEntry() {
        this.setState({isModalOpen: true});
    }

    @autobind
    closeOfferEntry() {
        this.setState({isModalOpen: false});
    }


    render() {

        var {businessStore, couponsStore} = this.props.route;
        var offerStore = businessStore.offerStore;
        var {isModalOpen} = this.state;

        return (

            <div className={style.wrapper}>
                <h1 >Your Offers:</h1>
                    <p>פלטפורמת AdFriend מבוססת על מבצעים אותם בעלי העסקים ,מגדירים ולאחר מכן שולחים ללקוחותיהם, חבריהם ובני משפחותיהם במטרה שאלו יפיצו את המבצע ללקוחות פוטנציאליים לבית העסק.
                        הפלטפורה תומכת במספר בלתי מוגבל של מבצעים, אולם בשלב ראשון מומלץ להתחיל עם שניים עד שלושה מבצעים לצורך בחינת הפלטפורמה.
                        בכל מבצע ניתן (אך אין חובה) להגדיר הטבה למפיץ המבצע ו/או למקבל המבצע,
                        מבצעים הינם לב הפלטפורה והם אשר יקבעו את הצלחת הקמפיין, ולכן מומלץ להקדיש מחשבה להגדרת ההטבות, לניסוח ברור/מעניין/מושך לקוחות והן לבחירת התמונה.</p>
                <ul className={style.list}>
                    <li className={style.new_item} onClick={() => this.openOfferEntry()}>
                        <div className={style.new}>
                            <span className={style.plus}>+</span>
                            Add New Offer
                        </div>
                        {isModalOpen &&
                            <div className="fixedModal">
                                <div className="close" onClick={() => this.closeOfferEntry()}>X</div>
                                <OfferEntry businessStore={businessStore}  onSave={this.closeOfferEntry}/>
                            </div>
                        }
                    </li>
                    {offerStore.offers.map((offer) => (
                            <Offer couponsStore={couponsStore} businessStore={businessStore} className={style.item} key={offer.id} offer={offer}/>
                        )
                    )}
                </ul>
            </div>


        )
    }
}

export default CSSModules(Offers, style);
