RFS.AwsS3 = class extends RFS {
	// Constructs the AWS S3 file system.
	// callback is called when everything is done, and takes nothing.
	constructor(accessKey, secretKey, region, bucket, callback) {
		super();
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

	// Gets the root folder.
	// Callback takes the folder.
	root(callback) {
		callback(new RFS.AwsS3.Folder(this._s3, this._bucket, '', '', null));
	}

	// Gets an Entry from the id.
	get(id, callback) {
		if (id.endsWith('/')) {
			let i = id.lastIndexOf('/', id.length - 2);
			let parentId = id.substr(0, i + 1);
			let name = id.substr(i + 1, id.length - 2 - i);
			callback(new RFS.AwsS3.Folder(this._s3, this._bucket, id, name, parentId));
		}
		else {
			let i = id.lastIndexOf('/', id.length - 1);
			let parentId = id.substr(0, i + 1);
			let name = id.substr(i + 1);
			callback(new RFS.AwsS3.File(this._s3, this._bucket, id, name, parentId));
		}
	}

	// Deletes an id.
	// Callback takes nothing.
	delete(id, callback) {
		let params = {
			Bucket: this._bucket,
			Key: id
		};
		this._s3.deleteObject(params, function (err, data) {
			console.log(err);
			console.log(data);
			callback();
		}.bind(this));
	}
}

RFS.AwsS3.File = class extends RFS.Entry {
	// Constructs a File.
	// Id is a uniquely identifying string.
	// Name is a human-readable name.
	// ParentId is the id of the parent.
	constructor(s3, bucket, id, name, parentId) {
		super(id, name, parentId, false);
		this._s3 = s3;
		this._bucket = bucket;
	}

	// Gets the contents of the file.
	// Callback takes the data.
	load(callback) {
		let params = {
			Bucket: this._bucket,
			Key: this.id()
		};
		this._s3.getObject(params, function (err, data) {
			callback(new TextDecoder("utf-8").decode(data.Body));
		}.bind(this));
	}

	// Saves the data to the file.
	// Callback takes nothing.
	save(data, callback) {
		let params = {
			Bucket: this._bucket,
			Key: this.id(),
			Body: data
		};
		this._s3.putObject(params, function (err, data) {
			callback();
		}.bind(this));
	}

	// Gets the parent folder.
	// Callback takes the Folder that is the parent of this entry.
	parent(callback) {
		let i = id().lastIndexOf('/');
		let i2 = id().lastIndexOf('/', i - 1);
		let id = id().substring(0, i + 1);
		let name = id().substring(i2 + 1, i);
		let parentId = id().substring(0, i2 + 1);
		callback(new RFS.AwsS3.Folder(this._s3, this._bucket, id, name, parentId));
	}
}

RFS.AwsS3.Folder = class extends RFS.Entry {
	// Constructs a Folder.
	// Id is a uniquely identifying string.
	// Name is a human-readable name.
	// ParentId is the id of the parent.
	constructor(s3, bucket, id, name, parentId) {
		super(id, name, parentId, true);
		this._s3 = s3;
		this._bucket = bucket;
	}

	// Gets a child of the given name.
	// Callback takes the File or Folder found.
	child(name, callback) {
		let params = {
			Bucket: this._bucket,
			Key: this.id() + name
		};
		this._s3.headObject(params, function (err, data) {
			if (err) {
				params.Key = this.id() + name + '/';
				this._s3.headObject(params, function (err, data) {
					if (err) {
						callback(null);
					}
					else {
						callback(new RFS.AwsS3.Folder(this._s3, this._bucket, this.id() + name + '/', name, this.id()));
					}
				}.bind(this));
			}
			else {
				callback(new RFS.AwsS3.File(this._s3, this._bucket, this.id() + name, name, this.id()));
			}
		}.bind(this));
	}

	// Lists the child files in this folder.
	// Callback takes an dictionary of id => name entries that are the children of this folder.
	list(callback) {
		let params = {
			Bucket: this._bucket,
			Prefix: this.id(),
			Delimiter: '/'
		};
		this._s3.listObjectsV2(params, function (err, data) {
			let children = {};
			for (let i in data.CommonPrefixes) {
				let prefix = data.CommonPrefixes[i].Prefix;
				if (prefix == this.id()) {
					continue;
				}
				let name = prefix.substring(prefix.lastIndexOf('/', prefix.length - 2) + 1, prefix.length - 1);
				children[prefix] = name;
			}
			for (let i in data.Contents) {
				let key = data.Contents[i].Key;
				if (key == this.id()) {
					continue;
				}
				let name = key.substr(key.lastIndexOf('/', key.length - 1) + 1);
				children[key] = name;
			}
			callback(children);
		}.bind(this));
	}

	// Creates a child file of the given name and type.
	// Callback takes the newly created File.
	createFile(name, type, callback) {
		let params = {
			Bucket: this._bucket,
			Key: this.id() + name,
			ContentType: type
		};
		this._s3.putObject(params, function (err, data) {
			callback(new RFS.AwsS3.File(this._s3, this._bucket, this.id() + name, name, this.id()));
		}.bind(this));
	}

	// Creates a child folder of the given name.
	// Callback takes the newly created Folder.
	createFolder(name, callback) {
		let params = {
			Bucket: this._bucket,
			Key: this.id() + name + '/'
		};
		this._s3.putObject(params, function (err, data) {
			callback(new RFS.AwsS3.Folder(this._s3, this._bucket, this.id() + name + '/', name, this.id()));
		}.bind(this));
	}

	// Gets the parent folder.
	// Callback takes the Folder that is the parent of this entry.
	parent(callback) {
		let i = id().lastIndexOf('/', id().length - 2);
		let i2 = id().lastIndexOf('/', i - 1);
		let id = id().substring(0, i + 1);
		let name = id().substring(i2 + 1, i);
		let parentId = id().substring(0, i2 + 1);
		callback(new RFS.AwsS3.Folder(this._s3, this._bucket, id, name, parentId));
	}
}