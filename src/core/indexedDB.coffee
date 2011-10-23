indexedDB = window.webkitIndexedDB
IDBTransaction = window.webkitIDBTransaction
IDBKeyRange = window.webkitIDBKeyRange
store_setting =
	community:
		index: 'id'
	live:
		index: 'id'
	user:
		index: 'id'
	chat:
		index: 'id'

createObjectStore = (version) ->
	request = @db.setVersion(version)
	request.onsuccess = (event) =>
		$.each(store_setting, (key, value) =>
			store = @db.createObjectStore(key, {keyPath: value['index']})
			store.createIndex(value['index'], value['index'], { unique: value['unique'] })
			console.log "#{key} テーブルを作成しました"
		)
	request.onerror = (event) =>
		throw new Error 'createStoreで失敗しました'

$.nlcm.DB = class
	constructor: (dbname, version) ->
		request = indexedDB.open(dbname)
		request.onsuccess = (event) =>
			@db = request.result
			createObjectStore.call(@, version) if @db.version isnt version
			console.log 'DBの通信に成功しました.'
		request.onerror = (event) ->
			throw new Error 'DBの通信に失敗しました.'

	addData: (name, data) ->
		store = @db.transaction([], IDBTransaction.READ_WRITE).objectStore(name)
		store.add(data)

	getData: (name, index_tx, search, callback) ->
		store = @db.transaction([], IDBTransaction.READ_ONLY).objectStore(name)
		request = store.index(index_tx).get(search)
		request.onsuccess = (event) =>
			callback(event.target.result)
		request.onerror = (event) =>
			throw new Error 'getDataで失敗しました'

	updateData: (name, index_tx, search, redata) ->
		store = @db.transaction([], IDBTransaction.READ_WRITE).objectStore(name)
		request = store.index(index_tx).openCursor(IDBKeyRange.only(search))
		request.onsuccess = (event) =>
			cursor = event.target.result
			if cursor?
				data = $.extend({}, cursor.value, redata)
				cursor.update(data)

	close: () ->
		@db.close()
		console.log 'DBを終了しました'
