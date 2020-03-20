'use strict';

const mongoose = require('mongoose');

class CategoriesDao {
	constructor (mongooseModule) {
		this._mongooseModule = mongooseModule;
	}

	static createDefault () {
		return new this(mongoose);
	}

	static getModelName () {
		return 'Categories';
	}

	getModel () {
		if (!this._model) {
			this._createModel();
		}
		return this._model;
	}

	getSchema () {
		if (!this._schema) {
			this._createSchema();
		}
		return this._schema;
	}

	async list () {
		const Model = this.getModel();
		const documentList = await Model.find({});
		return documentList;
	}

	async create (name) {
		const Model = this.getModel();
		const document = new Model({ name });
		await document.save();
		return document;
	}

	async read (id) {
		const Model = this.getModel();
		const document = await Model.findById(id).orFail();
		return document;
	}

	async update (id, name) {
		const Model = this.getModel();
		const document = await Model.findByIdAndUpdate(id, { name }, this._getUpdateOptions()).orFail();
		return document;
	}

	async delete (id) {
		const Model = this.getModel();
		const document = await Model.findByIdAndDelete(id).orFail();
		return document;
	}

	documentToObject (document) {
		const { _id, name } = document;
		const id = _id.toString();
		return { id, name };
	}

	documentListToObject (documentList) {
		return documentList.map((document) => this.documentToObject(document));
	}

	_createModel () {
		const schema = this.getSchema();
		this._model = this._mongooseModule.model(this.constructor.getModelName(), schema);
	}

	_createSchema () {
		this._schema = new this._mongooseModule.Schema(this._getSchemaDescriptor());
	}

	_getSchemaDescriptor () {
		return {
			name: { type: String, required: true, unique: true },
		};
	}

	_getUpdateOptions () {
		return {
			new: true,
		};
	}
}

module.exports = { CategoriesDao };
