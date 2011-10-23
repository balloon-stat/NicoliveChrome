(function() {
  var IDBKeyRange, IDBTransaction, createObjectStore, indexedDB, store_setting;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  indexedDB = window.webkitIndexedDB;
  IDBTransaction = window.webkitIDBTransaction;
  IDBKeyRange = window.webkitIDBKeyRange;
  store_setting = {
    community: {
      index: 'id'
    },
    live: {
      index: 'id'
    },
    user: {
      index: 'id'
    },
    chat: {
      index: 'id'
    }
  };
  createObjectStore = function(version) {
    var request;
    request = this.db.setVersion(version);
    request.onsuccess = __bind(function(event) {
      return $.each(store_setting, __bind(function(key, value) {
        var store;
        store = this.db.createObjectStore(key, {
          keyPath: value['index']
        });
        store.createIndex(value['index'], value['index'], {
          unique: value['unique']
        });
        return console.log("" + key + " テーブルを作成しました");
      }, this));
    }, this);
    return request.onerror = __bind(function(event) {
      throw new Error('createStoreで失敗しました');
    }, this);
  };
  $.nlcm.DB = (function() {
    function _Class(dbname, version) {
      var request;
      request = indexedDB.open(dbname);
      request.onsuccess = __bind(function(event) {
        this.db = request.result;
        if (this.db.version !== version) {
          createObjectStore.call(this, version);
        }
        return console.log('DBの通信に成功しました.');
      }, this);
      request.onerror = function(event) {
        throw new Error('DBの通信に失敗しました.');
      };
    }
    _Class.prototype.addData = function(name, data) {
      var store;
      store = this.db.transaction([], IDBTransaction.READ_WRITE).objectStore(name);
      return store.add(data);
    };
    _Class.prototype.getData = function(name, index_tx, search, callback) {
      var request, store;
      store = this.db.transaction([], IDBTransaction.READ_ONLY).objectStore(name);
      request = store.index(index_tx).get(search);
      request.onsuccess = __bind(function(event) {
        return callback(event.target.result);
      }, this);
      return request.onerror = __bind(function(event) {
        throw new Error('getDataで失敗しました');
      }, this);
    };
    _Class.prototype.updateData = function(name, index_tx, search, redata) {
      var request, store;
      store = this.db.transaction([], IDBTransaction.READ_WRITE).objectStore(name);
      request = store.index(index_tx).openCursor(IDBKeyRange.only(search));
      return request.onsuccess = __bind(function(event) {
        var cursor, data;
        cursor = event.target.result;
        if (cursor != null) {
          data = $.extend({}, cursor.value, redata);
          return cursor.update(data);
        }
      }, this);
    };
    _Class.prototype.close = function() {
      this.db.close();
      return console.log('DBを終了しました');
    };
    return _Class;
  })();
}).call(this);
