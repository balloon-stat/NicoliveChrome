(function($) {
	$.extend({
		indexedDB: (function() {
			var indexedDB = window.webkitIndexedDB,
				IDBTransaction = window.webkitIDBTransaction,
				IDBKeyRange = window.webkitIDBKeyRange,
				store_setting = {
					community: { index: 'id'/*, unique: true */},
					live: { index: 'id'/*, unique: true */},
					user: { index: 'id'/*, unique: true */},
					chat: { index: 'id'/*, unique: true */}
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
						that.db.onerror = function(event) {
							console.log(event);
						};
						if(that.db.version != version)
							that.createObjectStore(version);
						if(!that.db.version)
							throw new Error('Indexed DB version is not defined');
						console.log('Indexed DB open success : ' + dbname);
						console.log(that.db);
						
						// test
						/*
						$.each(store_setting, function(key, value) {
							var store = that.db.transaction([]).objectStore(key);
							var c = store.openCursor();
							c.onsuccess = function(event) {
								var cursor = event.target.result;
								if(!cursor) return;
								console.log(key + ' table');
								console.log(cursor.value);
								cursor.continue();
							};
							c.onerror = function(event) {
								console.log(event);
							}
						});
						*/
					};
					request.onerror = function(event) {
						throw new Error('indexed DB open Error : ' + dbname);
					};
				},
				// TODO onsuccess が呼ばれない
				createObjectStore: function(version) {
					var that = this,
						request = that.db.setVersion(version);
					console.log('createObjectStore');
					request.onsuccess = function(event) {
						$.each(store_setting, function(key, value) {
							try {
								var store = that.db.createObjectStore(key, {keyPath: value['index']});
								store.createIndex(value['index'], value['index'], { unique: value['unique'] });
								console.log(key + 'を作成します');
							} catch (e) {
								console.log('既に' + key + '作成されています');
							}
						});
						console.log(that.db);
					};
					request.onerror = function(event) {
						throw new Error('createStore is failed');
					};
				},
				addData: function(name, data) {
					console.log('addData');
					var store = this.db.transaction([], IDBTransaction.READ_WRITE).objectStore(name);
					console.log(data);
					store.add(data);
				},
				getData: function(name, index_tx, search, func) {
					var store = this.db.transaction([], IDBTransaction.READ_ONLY).objectStore(name),
						request = store.index(index_tx).get(search);
					console.log('getData');
					request.onsuccess = function(event) {
						console.log('getData success');
						func(event.target.result);
					};
					request.onerror = function(event) {
						console.log('error');
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
							console.log(tmp);
							cursor.update(tmp);
						}
					};
				}
			};
			
			return IndexedDB;
		})()
	});
})(jQuery);
