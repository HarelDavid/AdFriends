import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {copyTextToClipboard, isMobile} from '../../utils';

import './style.scss';


@observer
export default class Share extends Component {

	static propTypes = {
		link: PropTypes.string,
		offer: PropTypes.object.isRequired
	};

	@observable
	state = {
		message: "",
		shareMsg: ""
    }


    @autobind
    updatePreMessage(event) {
        this.state.message = event.target.value;
    }


    onClickCopy(str){
        copyTextToClipboard(str).then(res=>{
        	console.log(res);
		})
	}


	render() {
		let {offer, link} = this.props,
			{message, shareMsg} = this.state;
        let shareUrl = "whatsapp://send?text=" + (message || offer.preMessage) + " " + link;

console.log(link);

        return (
			<div className="Share">

				<TextField label="הודעה ללקוח" multiLine={true} name="message"
						   defaultValue={offer.preMessage} hintText="שלח הודעה ללקוח"
						   onChange={this.updatePreMessage} />

				<RaisedButton backgroundColor="#25D366">
                    {isMobile() ?
						<a href={shareUrl} style={{color: '#fff', textDecoration: 'none'}}
						   className="whatsup-share-button">
							<FontIcon className="material-icons"
									  style={{
                                          color: '#fff',
                                          fontSize: 16,
                                          marginLeft: 4,
                                          verticalAlign: 'sub'
                                      }}>share</FontIcon>
							שתף</a>
                        :
						<span style={{color: '#fff'}}
							  onClick={() => copyTextToClipboard(message ? message + "  " + link : offer.preMessage + "  " + link)}><FontIcon
							className="material-icons"
							style={{color: '#fff', fontSize: 16, marginLeft: 4, verticalAlign: 'middle'}}>share</FontIcon> שתף</span>
                    }
				</RaisedButton>


			</div>
		);
	}
}

