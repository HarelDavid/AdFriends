import React, {PropTypes} from 'react';
import {observer} from 'mobx-react';
import Offer from './Offer'
import {observable} from 'mobx';
import classname from 'classnames';
import autobind from 'autobind-decorator'
import {Link} from 'react-router'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

import './style.scss';


@observer
export default class Offers extends React.Component {



    render() {

        var {businessStore, couponsStore} = this.props.route;
        var offerStore = businessStore.offerStore;


        return (

            <div className="offers-wrapper">
                <h1>מבצעים</h1>
                    <p>פלטפורמת AdFriend מבוססת על מבצעים אותם בעלי העסקים ,מגדירים ולאחר מכן שולחים ללקוחותיהם, חבריהם ובני משפחותיהם במטרה שאלו יפיצו את המבצע ללקוחות פוטנציאליים לבית העסק.
                        הפלטפורה תומכת במספר בלתי מוגבל של מבצעים, אולם בשלב ראשון מומלץ להתחיל עם שניים עד שלושה מבצעים לצורך בחינת הפלטפורמה.
                        בכל מבצע ניתן (אך אין חובה) להגדיר הטבה למפיץ המבצע ו/או למקבל המבצע,
                        מבצעים הינם לב הפלטפורה והם אשר יקבעו את הצלחת הקמפיין, ולכן מומלץ להקדיש מחשבה להגדרת ההטבות, לניסוח ברור/מעניין/מושך לקוחות והן לבחירת התמונה.</p>
                        <Link to="offer/new-offer" className="offer-new">
                            <RaisedButton primary={true} label="צור הצעה חדשה" onTouchTap={() => this.openOfferEntry()} icon={<FontIcon className="material-icons">event_note</FontIcon>}  />
                        </Link>
                <div className="offers-list">
                    {offerStore.offers.map((offer) => (
                            <Offer couponsStore={couponsStore} businessStore={businessStore} className="offer" key={offer.id} offer={offer}/>

                        )
                    )}
                </div>
            </div>


        )
    }
}

