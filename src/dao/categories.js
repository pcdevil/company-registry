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
		return this._transformToObjectList(documentList);
	}

	async create (rawProperties) {
		const Model = this.getModel();
		const properties = this._filterProperties(rawProperties);
		const document = new Model(properties);
		await document.save();
		return this._transformToObject(document);
	}

	async read (id) {
		const Model = this.getModel();
		const document = await Model.findById(id).orFail();
		return this._transformToObject(document);
	}

	async update (id, rawProperties) {
		const Model = this.getModel();
		const properties = this._filterProperties(rawProperties);
		const document = await Model.findByIdAndUpdate(id, properties, this._getUpdateOptions()).orFail();
		return this._transformToObject(document);
	}

	async delete (id) {
		const Model = this.getModel();
		const document = await Model.findByIdAndDelete(id).orFail();
		return this._transformToObject(document);
	}

	_createModel () {
		try {
			this._model = this._mongooseModule.model(this.constructor.getModelName());
		} catch (e) {
			const schema = this.getSchema();
			this._model = this._mongooseModule.model(this.constructor.getModelName(), schema);
		}
	}

	_createSchema () {
		this._schema = new this._mongooseModule.Schema(this._getSchemaDescriptor());
	}

	_createPropertyKeyList () {
		this._propertyKeyList = Object.keys(this._getSchemaDescriptor());
	}

	_filterProperties (properties) {
		const entries = Object.entries(properties)
			.filter(([property, value]) => this._hasProperty(property));
		return Object.fromEntries(entries);
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

	_hasProperty (property) {
		if (!this._propertyKeyList) {
			this._createPropertyKeyList();
		}
		return this._propertyKeyList.includes(property);
	}

	_transformToObject (document) {
		const { _id, ...properties } = document;
		const id = _id.toString();
		const rawProperties = this._filterProperties(properties);
		return { id, ...rawProperties };
	}

	_transformToObjectList (documentList) {
		return documentList.map((document) => this._transformToObject(document));
	}
}

module.exports = { CategoriesDao };
