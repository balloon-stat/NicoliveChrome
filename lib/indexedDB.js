(function($) {
	$.extend({
		indexedDB: (function() {
			var indexedDB = window.webkitIndexedDB,
				IDBTransaction = window.webkitIDBTransaction,
				store_setting = {
					community: { index: 'id', unique: true },
					live: { index: 'id', unique: true },
					user: { index: 'id', unique: true },
					chat: { index: 'id', unique: true }
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
						that.createObjectStore(version);
						console.log('Indexed DB open success : ' + dbname);
						
						// test
						$.each(store_setting, function(key, value) {
							var store = that.db.transaction([]).objectStore(key);
							var c = store.openCursor();
							c.onsuccess = function(event) {
								var cursor = event.target.result;
								if(!cursor) return;
								console.log(key + ' table');
								console.log(cursor.value);
								cursor.continue();
							}
						});
					};
					request.onerror = function(event) {
						throw new Error('indexed DB open Error : ' + dbname);
					};
				},
				createObjectStore: function(version) {
					var that = this,
						request = this.db.setVersion(version);
					request.onsuccess = function(event) {
						$.each(store_setting, function(key, value) {
							var store;
							try {
								store = that.db.createObjectStore(key, {keyPath: value['index']});
								store.createIndex(value['index'], value['index'], { unique: value['unique'] });
								console.log(key + 'を作成します');
							} catch (e) {
								console.log('既に' + key + '作成されています');
							}
						});
					};
					request.onerror = function(event) {
						throw new Error('createStore is failed');
					};
				},
				addData: function(name, data) {
					console.log('addData');
					var store = this.db.transaction([], IDBTransaction.READ_WRITE).objectStore(name);
					store.put(data);
				},
				getData: function(name, index_tx, search, func) {
					var store = this.db.transaction([]).objectStore(name),
						re = store.index(index_tx).get(search);
					re.onsuccess = function(event) {
						func(event.target.result);
					};
				}
			};
			
			return IndexedDB;
		})()
	});
})(jQuery);
