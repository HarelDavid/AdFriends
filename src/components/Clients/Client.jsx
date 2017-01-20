import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';




const ESCAPE_KEY = 27;
const ENTER_KEY = 13;



@observer
export default class Client extends React.Component {
	// @observable editText = "";
	// viewStore;
	//
	// componentWillMount(){
	//
	//
	// }
	// render() {
	// 	const { client} = this.props;
	//
	//
	// 	return (
	// 		<li className={[
	// 			client.completed ? "completed": "",
	// 			expr(() => client === .ItemBeingEdited ? "editing" : "")
	// 		].join(" ")}>
	// 			<div className="view">
	// 				<label onDoubleClick={this.handleEdit}>
	// 					{client.title}
	// 				</label>
	// 				<button className="destroy" onClick={this.handleDestroy} />
	// 			</div>
	//
	// 			<div className="view">
	// 				<img src={client.imageUrl}/>
	// 			</div>
	//
	// 			<input
	// 				ref="editField"
	// 				className="edit"
	// 				value={this.editText}
	// 				onBlur={this.handleSubmit}
	// 				onChange={this.handleChange}
	// 				onKeyDown={this.handleKeyDown}
	// 			/>
	// 		</li>
	// 	);
	// }
	//
	// handleSubmit = (event) => {
	// 	const val = this.editText.trim();
	// 	if (val) {
	// 		this.props.client.setTitle(val);
	// 		this.editText = val;
	// 	} else {
	// 		this.handleDestroy();
	// 	}
	// 	this.props.viewStore.itemBeingEdited = null;
	// };
	//
	// handleDestroy = () => {
	// 	this.props.client.destroy();
	// 	this.props.viewStore.itemBeingEdited = null;
	// };
	//
	// handleEdit = () => {
	// 	const client = this.props.client;
	// 	this.props.viewStore.itemBeingEdited = client;
	// 	this.editText = client.title;
	// };
	//
	// handleKeyDown = (event) => {
	// 	if (event.which === ESCAPE_KEY) {
	// 		this.editText = this.props.client.title;
	// 		this.props.viewStore.itemBeingEdited = null;
	// 	} else if (event.which === ENTER_KEY) {
	// 		this.handleSubmit(event);
	// 	}
	// };
	//
	// handleChange = (event) => {
	// 	this.editText = event.target.value;
	// };
	//
	// handleToggle = () => {
	// 	this.props.client.toggle();
	// };

}
