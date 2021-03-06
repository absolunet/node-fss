//--------------------------------------------------------
//-- XML
//--------------------------------------------------------
'use strict';

const { default: ow } = require('ow');
const xml2js          = require('xml2js');
const utils           = require('./helpers/utils');


const write = (file, object, options) => {
	return new Promise((resolve, reject) => {
		utils.writeMaybeCompressedFile(file, `${new xml2js.Builder(options).buildObject(object)}\n`, resolve, reject);
	});
};






class FspXml {

	read(file, options) {
		ow(file,    ow.string.nonEmpty);
		ow(options, ow.optional.object);

		return new Promise((resolve, reject) => {
			utils.readMaybeCompressedFile(file).then((data) => {
				xml2js.parseString(data, options, (error, result) => {
					if (error) {
						reject(error);
					}

					resolve(result);
				});
			}, reject);
		});
	}


	write(file, object, options) {
		ow(file,    ow.string.nonEmpty);
		ow(object,  ow.object);
		ow(options, ow.optional.object);

		return write(file, object, options);
	}


	output(file, object, options) {
		ow(file,    ow.string.nonEmpty);
		ow(object,  ow.object);
		ow(options, ow.optional.object);

		return new Promise((resolve, reject) => {
			utils.ensureContainingFolder(file).then(() => {
				write(file, object, options).then(resolve, reject);
			}, reject);
		});
	}

}


module.exports = new FspXml();
