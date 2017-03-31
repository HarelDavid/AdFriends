import {observable} from 'mobx';

export default class BusinessModel {
	store;
	id;
	@observable title;
	@observable imageUrl;
	@observable photoURL; //????
	@observable phone;
	@observable address;
	@observable website;
	@observable facebook;
	@observable businessType;
	@observable description;


	constructor(id, title, photoURL, phone, address, website, facebook, businessType, description) {
		this.id = id;
		this.title = title;
		this.imageUrl = photoURL;
		this.phone = phone;
		this.address = address;
		this.website = website;
		this.facebook = facebook;
		this.businessType = businessType;
		this.description = description;
	}


    convertFromDB(businessDB) {
        this.title = businessDB.title;
        this.description = businessDB.description;
        this.imageUrl = businessDB.imageUrl;
        this.phone = businessDB.phone;
        this.address = businessDB.address;
        this.website = businessDB.website;
        this.facebook = businessDB.facebook;
        this.businessType = businessDB.businessType;

    }

    convertToDB() {
        var businessDB = {}
        this.id ? businessDB.id = this.id : "";
        this.title ? businessDB.title = this.title : "";
        this.description ? businessDB.description = this.description : "";
        this.imageUrl ? businessDB.imageUrl = this.imageUrl : "";
        this.phone ? businessDB.phone = this.phone : "";
        this.address ? businessDB.address = this.address : "";
        this.website ? businessDB.website = this.website : "";
        this.facebook ? businessDB.facebook = this.facebook : "";
        this.businessType ? businessDB.businessType = this.businessType : "";

        return businessDB;
    }

    save(){
        this.store.save(this);
    }


    destroy() {
		this.store.remove(this);//.offers.remove(this);
	}

	toJS() {
		return {
			id: this.id,
			title: this.title,
			imageUrl: this.imageUrl,
			phone: this.phone,
			address: this.address,
			website: this.website,
			facebook: this.facebook,
            businessType: this.businessType,
            description: this.description,
            key: this.key
        };
	}

	static fromJS(store, object) {
		return new BusinessModel(store, object.id, object.title, object.description,object.imageUrl, object.phone,
			object.address, object.website, object.facebook, object.businessType, object.key);
	}
}
