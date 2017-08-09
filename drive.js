var Drive = function (clientId, onload, signInButton) {
	this._clientId = clientId;
	this._onload = onload;
	this._signInButton = signInButton;

	// Add script tag.
	var scriptTag = document.createElement('script');
	scriptTag.src = 'https://apis.google.com/js/api.js';
	scriptTag.onload = function () {
		gapi.load('client:auth2', function () {
			gapi.client.init({
				'clientId': this._clientId,
				'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
				'scope': 'https://www.googleapis.com/auth/drive.file'
			}).then(function () {
				if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
					gapi.auth2.getAuthInstance().isSignedIn.listen(function (signedIn) {
						if (signedIn) {
							this._signInButton.style.display = 'none';
							this._onload();
						}
					}.bind(this));
					this._signInButton.style.display = 'block';
					this._signInButton.innerHTML = "Sign In";
					this._signInButton.onclick = this._signIn;
				}
				else {
					this._signInButton.style.display = 'none';
					this._onload();
				}
			}.bind(this));
		}.bind(this));
	}.bind(this);
	document.body.appendChild(scriptTag);
}

Drive.prototype.root = function () {
	return new DriveFile(this, 'root', '', 'application/vnd.google-apps.folder');
}

Drive.prototype._signIn = function () {
	gapi.auth2.getAuthInstance().signIn();
}

// A JS representation of a Google Drive file or folder.
var DriveFile = function (drive, id, name, mimeType) {
	this.drive = drive;
	this.id = id;
	this.name = name;
	this.mimeType = mimeType;
}

DriveFile.prototype.get = function (callback) {
	gapi.client.drive.files.get({
		'fileId': this.id,
		'alt': 'media'
	}).then(function (response) {
		callback(response.body);
	}.bind(this));
}

// Returns the child file of the given name in the folder, or None of the file does not exist
DriveFile.prototype.child = function (name, callback) {
	gapi.client.drive.files.list({
		'q': '\'' + this.id + '\' in parents and name = \'' + name.replace('\\', '\\\\').replace("'", "\\'") + '\' and trashed = false',
		'fields': 'nextPageToken, files(id, name, parents, mimeType)'
	}).then(function (response) {
		if (response.result.files.length > 0) {
			var file = response.result.files[0];
			callback(new DriveFile(this.drive, file.id, file.name, file.mimeType));
		}
		else {
			callback(null);
		}
	}.bind(this));
}

DriveFile.prototype.createFolder = function (name, callback) {
	gapi.client.drive.files.create({
		'resource': {
			'name': name,
			'parents': [{
				'id': this.id
			}],
			'mimeType': 'application/vnd.google-apps.folder'
		}
	}).then(function (response) {
		callback(new DriveFile(this.drive, response.result.id, name, 'application/vnd.google-apps.folder'));
	}.bind(this));
}

DriveFile.prototype.createFile = function (name, mimeType, text, callback) {
	var boundary = '314159265358979323846';
	var json = {
		"name": name,
		"mimeType": mimeType,
		"parents": [this.id]
	}
	var multipartRequestBody =
		'\r\n--' + boundary + '\r\n' +
		'Content-Type: application/json\r\n\r\n' +
		JSON.stringify(json) +
		'\r\n--' + boundary + '\r\n' +
		'Content-Type: ' + mimeType + '\r\n\r\n' +
		text +
		'\r\n--' + boundary + '--';
	var request = gapi.client.request({
		'path': '/upload/drive/v3/files',
		'method': 'POST',
		'params': { 'uploadType': 'multipart' },
		'headers': {
			'Content-Type': 'multipart/related; boundary="' + boundary + '"'
		},
		'body': multipartRequestBody
	});
	request.execute(function (response) {
		callback(new DriveFile(this.drive, response.id, name, mimeType));
	}.bind(this));
}

DriveFile.prototype.update = function (text, callback) {
	var request = gapi.client.request({
		'path': '/upload/drive/v3/files/' + this.id,
		'method': 'PATCH',
		'params': { 'uploadType': 'media' },
		'headers': {
			'Content-Type': this.mimeType
		},
		'body': text
	});
	request.execute(function (response) {
		callback();
	}.bind(this));
}

DriveFile.prototype.delete = function (callback) {
	var request = gapi.client.request({
		'path': '/drive/v3/files/' + this.id,
		'method': 'DELETE',
	});
	request.execute(function (response) {
		callback();
	}.bind(this));
}

DriveFile.prototype.list = function (callback, pageToken) {
	gapi.client.drive.files.list({
		'folderId': this.id,
		'orderBy': 'name',
		'pageSize': 1000,
		'pageToken': pageToken,
		'q': '"' + this.id + '" in parents',
		'fields': 'nextPageToken, files(id, name, parents, mimeType, trashed)'
	}).then(function (response) {
		files = [];
		for (var i = 0; i < response.result.files.length; i++) {
			var file = response.result.files[i];
			if (!file.trashed) {
				files.push(file.name);
			}
		}
		callback(files);
	});
}