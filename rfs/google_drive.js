RFS.GoogleDrive = class extends RFS {
	// Constructs the google drive file system.
	// clientId is used for authentication.
	// signInButton is clicked by the user to initiate the sign in.
	// callback is called when everything is done, and takes nothing.
	constructor(clientId, signInButton, callback) {
		super();
		let scriptTag = document.createElement('script');
		scriptTag.src = 'https://apis.google.com/js/api.js';
		scriptTag.onload = function () {
			gapi.load('client:auth2', function () {
				gapi.client.init({
					'clientId': clientId,
					'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
					'scope': 'https://www.googleapis.com/auth/drive.file'
				}).then(function () {
					if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
						gapi.auth2.getAuthInstance().isSignedIn.listen(function (signedIn) {
							if (signedIn) {
								signInButton.style.display = 'none';
								callback();
							}
						});
						signInButton.style.display = 'block';
						signInButton.innerHTML = "Sign In";
						signInButton.onclick = gapi.auth2.getAuthInstance().signIn;
					}
					else {
						signInButton.style.display = 'none';
						callback();
					}
				});
			});
		};
		document.body.appendChild(scriptTag);
	}

	// Gets the root folder.
	// Callback takes the folder.
	root(callback) {
		callback(new RFS.GoogleDrive.Folder('root', '', ''));
	}

	// Gets an Entry from the id.
	// Callback takes an Entry.
	get(id, callback) {
		gapi.client.drive.files.get({
			'fileId': id,
			'fields': 'id, name, parents, mimeType'
		}).then(function (response) {
			if (response.result.mimeType == 'application/vnd.google-apps.folder') {
				callback(new RFS.GoogleDrive.Folder(response.result.id, response.result.name, response.result.parents[0]));
			}
			else {
				callback(new RFS.GoogleDrive.File(response.result.id, response.result.name, response.result.parents[0], response.result.mimeType));
			}
		});
	}

	// Deletes an id.
	// Callback takes nothing.
	delete(id, callback) {
		let request = gapi.client.request({
			'path': '/drive/v3/files/' + id,
			'method': 'DELETE',
		});
		request.execute(function (response) {
			callback();
		});
	}
}

RFS.GoogleDrive.File = class extends RFS.File {
	constructor(id, name, parentId, mimeType) {
		super(id, name, parentId);
		this._mimeType = mimeType;
	}

	// Gets the contents of the file.
	// Callback takes the data.
	load(callback) {
		gapi.client.drive.files.get({
			'fileId': this._id,
			'alt': 'media'
		}).then(function (response) {
			callback(response.body);
		});
	}

	// Saves the data to the file.
	// Callback takes nothing.
	save(data, callback) {
		let request = gapi.client.request({
			'path': '/upload/drive/v3/files/' + this._id,
			'method': 'PATCH',
			'params': {
				'uploadType': 'media'
			},
			'headers': {
				'Content-Type': this._mimeType
			},
			'body': data
		});
		request.execute(function (response) {
			callback();
		});
	}

	// Gets the parent folder.
	// Callback takes the Folder that is the parent of this file.
	parent(callback) {
		gapi.client.drive.files.get({
			'fileId': this._parentId,
			'fields': 'files(id, name, parents)'
		}).then(function (response) {
			callback(new RFS.GoogleDrive.Folder(response.id, response.name, response.parents[0]));
		});
	}
}

RFS.GoogleDrive.Folder = class extends RFS.Folder {
	constructor(id, name, parentId) {
		super(id, name, parentId);
	}

	// Gets a child of the given id.
	// Callback takes the File.
	child(name, callback) {
		gapi.client.drive.files.list({
			'q': '\'' + this._id + '\' in parents and name = \'' + name.replace('\\', '\\\\').replace("'", "\\'") + '\' and trashed = false',
			'fields': 'nextPageToken, files(id, name, parents, mimeType)'
		}).then(function (response) {
			if (response.result.files.length > 0) {
				var file = response.result.files[0];
				if (file.mimeType == 'application/vnd.google-apps.folder') {
					callback(new RFS.GoogleDrive.Folder(file.id, file.name, file.parents[0]));
				}
				else {
					callback(new RFS.GoogleDrive.File(file.id, file.name, file.parents[0], file.mimeType));
				}
			}
			else {
				callback(null);
			}
		});
	}

	// Lists the child files in this folder.
	// Callback takes an dictionary of id => name entries that are the children of this folder.
	list(callback) {
		gapi.client.drive.files.list({
			'folderId': this._id,
			'orderBy': 'name',
			'pageSize': 1000,
			'pageToken': '',
			'q': '"' + this._id + '" in parents',
			'fields': 'files(id, name, parents, mimeType, trashed)'
		}).then(function (response) {
			let files = {};
			for (let i = 0; i < response.result.files.length; i++) {
				let file = response.result.files[i];
				if (!file.trashed) {
					files[file.id] = file.name;
				}
			}
			callback(files);
		});
	}

	// Creates a child file of the given id and type.
	// Callback takes the newly created File.
	createFile(name, type, callback) {
		gapi.client.drive.files.create({
			'resource': {
				'name': name,
				'parents': [this._id],
				'mimeType': type
			}
		}).then(function (response) {
			callback(new RFS.GoogleDrive.File(response.result.id, name, this._id, type));
		}.bind(this));
	}

	// Creates a child folder of the given name.
	// Callback takes the newly created Folder.
	createFolder(name, callback) {
		gapi.client.drive.files.create({
			'resource': {
				'name': name,
				'parents': [this._id],
				'mimeType': 'application/vnd.google-apps.folder'
			}
		}).then(function (response) {
			callback(new RFS.GoogleDrive.Folder(response.result.id, name, this._id));
		}.bind(this));
	}

	// Gets the parent folder.
	// Callback takes the Folder that is the parent of this folder.
	parent(callback) {
		gapi.client.drive.files.get({
			'fileId': this._parentId,
			'fields': 'files(id, name, parents)'
		}).then(function (response) {
			callback(new RFS.GoogleDrive.Folder(response.id, response.name, response.parents[0]));
		});
	}
}