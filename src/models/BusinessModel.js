import {observable} from 'mobx';

export default class BusinessModel {
	store;
	id;
	@observable title;
	@observable imageUrl;
	@observable phone;
	@observable address;
	@observable website;
	@observable facebook;
	@observable businessType;
	@observable description;


	constructor(data) {
		if(data) {
			this.id = data.uid || "";
			this.title = data.title || "";
			this.imageUrl = data.photoURL || "";
			this.phone = data.phone || "";
			this.address = data.address || "";
			this.website = data.website || "";
			this.facebook = data.facebook || "";
			this.businessType = data.businessType || "";
			this.description =  data.description || "";
            this.offers = data.offers || [];
            this.clients = data.clients || [];
		}
	}


    convertFromDB(businessDB) {
		this.id = businessDB.id;
        this.title = businessDB.title;
        this.description = businessDB.description;
        this.imageUrl = businessDB.imageUrl;
        this.phone = businessDB.phone;
        this.address = businessDB.address;
        this.website = businessDB.website;
        this.facebook = businessDB.facebook;
        this.businessType = businessDB.businessType;
		this.offers = businessDB.offers;
		this.clients = businessDB.clients;

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
