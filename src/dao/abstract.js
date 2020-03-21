'use strict';

const mongoose = require('mongoose');
const { NotImplementedError } = require('../lib');

class AbstractDao {
	constructor (mongooseModule) {
		this._mongooseModule = mongooseModule;
	}

	static createDefault () {
		return new this(mongoose);
	}

	static getModelName () {
		throw new NotImplementedError('getModelName');
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
		return documentList.map((document) => document.toObject(this._getToObjectOptions()));
	}

	async create (properties) {
		const Model = this.getModel();
		const document = new Model(properties);
		await document.save();
		return document.toObject(this._getToObjectOptions());
	}

	async read (id) {
		const Model = this.getModel();
		const document = await Model.findById(id).orFail();
		return document.toObject(this._getToObjectOptions());
	}

	async update (id, properties) {
		const Model = this.getModel();
		const document = await Model.findByIdAndUpdate(id, properties, this._getUpdateOptions()).orFail();
		return document.toObject(this._getToObjectOptions());
	}

	async delete (id) {
		const Model = this.getModel();
		const document = await Model.findByIdAndDelete(id).orFail();
		return document.toObject(this._getToObjectOptions());
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

	_getSchemaDescriptor () {
		throw new NotImplementedError('_getSchemaDescriptor');
	}

	_getUpdateOptions () {
		return {
			new: true,
		};
	}

	_getToObjectOptions () {
		return {
			versionKey: false,
		};
	}
}

module.exports = { AbstractDao };
