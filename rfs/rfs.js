class RFS {
	constructor() {}

	// Gets the root folder.
	// Callback takes the folder.
	root(callback) {
		console.log("Not implemented.");
	}

	// Gets an Entry from the id.
	get(id, callback) {
		console.log("Not implemented.");
	}

	// Deletes an id.
	// Callback takes nothing.
	delete(id, callback) {
		console.log("Not implemented.");
	}
}

RFS.Entry = class {
	// Constructs an Entry.
	// Id is a string unique to the entire file system.
	// Name is a human-readable name, unique to the parent folder.
	// ParentId is the id of the parent.
	constructor(id, name, parentId, isFolder) {
		this._id = id;
		this._name = name;
		this._parentId = parentId;
		this._isFolder = isFolder
	}

	// Returns the id.
	id() {
		return this._id;
	}

	// Returns the name.
	name() {
		return this._name;
	}

	// Returns the parent id.
	parentId() {
		return this._parentId;
	}

	// Returns true if the entry is a Folder.
	isFolder() {
		return this._isFolder;
	}

	// Gets the parent folder.
	// Callback takes the Folder that is the parent of this entry.
	parent(callback) {
		console.log("Not implemented.");
	}
}

RFS.File = class extends RFS.Entry {
	// Constructs a File.
	// Id is a uniquely identifying string.
	// Name is a human-readable name.
	// ParentId is the id of the parent.
	constructor(id, name, parentId) {
		super(id, name, parentId, false);
	}

	// Gets the contents of the file.
	// Callback takes the data.
	load(callback) {
		console.log("Not implemented.");
	}

	// Saves the data to the file.
	// Callback takes nothing.
	save(data, callback) {
		console.log("Not implemented.");
	}
}

RFS.Folder = class extends RFS.Entry {
	// Constructs a Folder.
	// Id is a uniquely identifying string.
	// Name is a human-readable name.
	// ParentId is the id of the parent.
	constructor(id, name, parentId) {
		super(id, name, parentId, true);
	}

	// Gets a child of the given name.
	// Callback takes the File or Folder found.
	child(name, callback) {
		console.log("Not implemented.");
	}

	// Lists the child files in this folder.
	// Callback takes an dictionary of id => name entries that are the children of this folder.
	list(callback) {
		console.log("Not implemented.");
	}

	// Creates a child file of the given name and type.
	// Callback takes the newly created File.
	createFile(name, type, callback) {
		console.log("Not implemented.");
	}

	// Creates a child folder of the given name.
	// Callback takes the newly created Folder.
	createFolder(name, callback) {
		console.log("Not implemented.");
	}
}