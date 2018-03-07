import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import CreateImg from '../../images/create.png';
import ShareImg from '../../images/share.png';
import LaptopImg from '../../images/laptop.png';


import './style.scss';


@observer
export default class HowToUse extends Component {

    static propTypes = {};

    @observable
    state = {}

    componentWillMount() {

    }


    render() {


        return (

            <div className="HowToUse">



                <p style={{fontSize: 16, textAlign: 'center'}}><b>איך AdFriend עובד?</b></p>

                <div className="stages">
                    <div className="stage-item">
                        <img src={CreateImg} alt=""/>
                        <div><b>צור קופון מותאם בקלות!</b>
                            <p>צור קידום מותאם לעסק שלך בממשק פשוט, נוח ובעברית מהטלפון הסלולארי או המחשב הביתי.</p>
                        </div>
                    </div>

                    <div className="stage-item">
                        <img src={ShareImg} alt=""/>
                        <div><b>שלח לחברים ולקוחות</b>
                            <p>Ad Friend מאפשרת לך לשתף את הקידום שיצרת בלחיצת כפתור.

                            </p>
                        </div>
                    </div>


                    <div className="stage-item">
                        <img src={LaptopImg} alt=""/>
                        <div><b>עקוב ונתח את הצלחת הקידום</b>
                            <p> מעקב אחר חשיפה ומספר הלקוחות החדשים שהגיעו בעקבות מבצעי ה"חבר מביא חבר" ודרך מי מהלקוחות
                                הגיעו.
                            </p></div>
                    </div>
                </div>
            </div>



        );
    }
}

