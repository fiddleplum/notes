// A simplified interface for the AWS S3 file system.
// All folders end in '/', except for the root, which is ''.
class S3 {
	// Constructs the AWS S3 file system.
	// callback is called when everything is done, and takes nothing.
	constructor(accessKey, secretKey, region, bucket, callback) {
		this._s3 = null;
		this._bucket = bucket;
		let scriptTag = document.createElement('script');
		scriptTag.src = 'aws-sdk.min.js';
		scriptTag.onload = function () {
			AWS.config.update({
				accessKeyId: accessKey,
				secretAccessKey: secretKey,
				region: region
			});
			this._s3 = new AWS.S3();
			callback();
		}.bind(this);
		document.body.appendChild(scriptTag);
	}

	// Returns the parent folder's path.
	parent(path) {
		if (path.endsWith('/')) {
			return path.substring(0, path.lastIndexOf('/', path.length - 2) + 1);
		}
		else {
			return path.substring(0, path.lastIndexOf('/') + 1);
		}
	}

	// Returns the name of the object at the path.
	name(path) {
		if (path.endsWith('/')) {
			return path.substring(path.lastIndexOf('/', path.length - 2) + 1, path.length - 1);
		}
		else {
			return path.substring(path.lastIndexOf('/') + 1);
		}
	}

	// Determins if an entry exists.
	// Callback takes a boolean.
	exists(path, callback) {
		let params = {
			Bucket: this._bucket,
			Key: path,
		};
		this._s3.headObject(params, function (err, data) {
			callback(err == null);
		});
	}

	// Lists the child folders and files in this folder, up to 1000 objects.
	// Callback takes an object { folders: [], files: [], marker }, of the entries that are the child names of this folder.
	// If the marker is not null, use the marker in subsequent calls to get more objects.
	list(path, callback, marker) {
		let params = {
			Bucket: this._bucket,
			Prefix: path,
			Delimiter: '/'
		};
		this._s3.listObjectsV2(params, function (err, data) {
			let children = {
				folders: [],
				files: [],
				marker: null
			};
			for (let i in data.CommonPrefixes) {
				let prefix = data.CommonPrefixes[i].Prefix;
				if (prefix == path) {
					continue;
				}
				let name = this.name(prefix);
				children.folders.push(name);
			}
			for (let i in data.Contents) {
				let key = data.Contents[i].Key;
				let name = this.name(key);
				children.files.push(name);
			}
			if (data.IsTrucated) {
				children.marker = data.NextMarker;
			}
			callback(children);
		}.bind(this));
	}

	// Creates a child file of the given name and type.
	// Callback takes the newly created file path.
	createFile(parentPath, name, type, callback) {
		let params = {
			Bucket: this._bucket,
			Key: parentPath + name,
			ContentType: type
		};
		this._s3.putObject(params, function (err, data) {
			callback(parentPath + name);
		});
	}

	// Creates a child folder of the given name.
	// Callback takes the newly created folder path..
	createFolder(parentPath, name, callback) {
		let params = {
			Bucket: this._bucket,
			Key: parentPath + name
		};
		this._s3.putObject(params, function (err, data) {
			callback(parentPath + name);
		});
	}

	// Deletes a object at the path.
	// If it is a folder, it only deletes it if there are no sub-folders or sub-files.
	// Callback takes boolean if it was deleted.
	delete(path, callback) {
		if (path.endsWith('/')) {
			let params = {
				Bucket: this._bucket,
				Prefix: path
			};
			this._s3.listObjectsV2(params, function (err, data) {
				if (data.CommonPrefixes.length == 0 && data.Contents.length == 1) { // 1 is for the path itself
					let params = {
						Bucket: this._bucket,
						Key: path
					};
					this._s3.deleteObject(params, function (err, data) {
						callback(true);
					});
				}
				else {
					callback(false);
				}
			}.bind(this));
		}
		else {
			let params = {
				Bucket: this._bucket,
				Key: path
			};
			this._s3.deleteObject(params, function (err, data) {
				callback(true);
			});
		}
	}

	// Gets the contents of the file at the path.
	// Callback takes the data.
	load(path, callback) {
		let params = {
			Bucket: this._bucket,
			Key: path
		};
		this._s3.getObject(params, function (err, data) {
			callback(new TextDecoder("utf-8").decode(data.Body));
		});
	}

	// Saves the data to the file at the path.
	// Callback takes nothing.
	save(path, data, callback) {
		let params = {
			Bucket: this._bucket,
			Key: path,
			Body: data
		};
		this._s3.putObject(params, function (err, data) {
			callback();
		});
	}
}