(function($) {
	$.extend({
		indexedDB: (function() {
			var indexedDB = window.webkitIndexedDB,
				IDBTransaction = window.webkitIDBTransaction,
				IDBKeyRange = window.webkitIDBKeyRange,
				store_setting = {
					community: { index: 'id'},
					live: { index: 'id'},
					user: { index: 'id'},
					chat: { index: 'id'}
				},
				IndexedDB = function(dbname, version) {
					if (!(this instanceof IndexedDB)) {
						return new IndexedDB();
					}
					this.init(dbname, version);
				};
			IndexedDB.prototype = {
				init: function(dbname, version) {
					var that = this,
						request = indexedDB.open(dbname);
					request.onsuccess = function(event) {
						that.db = request.result;
						if(that.db.version != version)
							that.createObjectStore(version);
						console.log('Indexed DB open success : ' + dbname);
					};
					request.onerror = function(event) {
						throw new Error('indexed DB open Error : ' + dbname);
					};
				},
				createObjectStore: function(version) {
					var that = this,
						request = that.db.setVersion(version);
					request.onsuccess = function(event) {
						console.log('createObjectStore');
						$.each(store_setting, function(key, value) {
							try {
								var store = that.db.createObjectStore(key, {keyPath: value['index']});
								store.createIndex(value['index'], value['index'], { unique: value['unique'] });
								console.log(key + 'is success');
							} catch (e) {
								console.log('already ' + key + ' is successed');
							}
						});
					};
					request.onerror = function(event) {
						throw new Error('createStore is failed');
					};
				},
				addData: function(name, data) {
					var store = this.db.transaction([], IDBTransaction.READ_WRITE).objectStore(name);
					store.add(data);
				},
				getData: function(name, index_tx, search, func) {
					var store = this.db.transaction([], IDBTransaction.READ_ONLY).objectStore(name),
						request = store.index(index_tx).get(search);
					request.onsuccess = function(event) {
						func(event.target.result);
					};
					request.onerror = function(event) {
						console.log('getData error');
						console.log(event);
					};
				},
				updateData: function(name, index_tx, search, redata) {
					var store = this.db.transaction([], IDBTransaction.READ_WRITE).objectStore(name),
						request = store.index(index_tx).openCursor(IDBKeyRange.only(search));
					request.onsuccess = function(event) {
						var cursor = event.target.result,
							tmp;
						console.log('update data');
						if(cursor) {
							tmp = cursor.value;
							$.extend(tmp, redata);
							cursor.update(tmp);
						}
					};
				},
				close: function() {
					console.log('Indexed DB close');
					this.db.close();
				}
			};
			return IndexedDB;
		})()
	});
})(jQuery);
