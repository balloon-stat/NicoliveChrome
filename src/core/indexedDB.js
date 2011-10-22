(function() {
  var IDBKeyRange, IDBTransaction, indexedDB, store_setting;
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
  $.nlcm.DB = (function() {
    var createObjectStore;
    function _Class(dbname, version) {
      var request;
      request = indexedDB.open(dbname);
      request.onsuccess = __bind(function(event) {
        this.db = request.result;
        if (this.db.version !== version) {
          this.createObjectStore(version);
        }
        return console.log("DBの通信に成功しました. dbname : " + dbname);
      }, this);
      request.onerror = function(event) {
        throw new Error("DBの通信に失敗しました. dbname : " + dbname);
      };
    }
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
    _Class.prototype.addData = function(name, data) {
      var store;
      store = this.db.transaction([], IDBTransaction.READ_WRITE).objectStore(name);
      return store.add(data);
    };
    _Class.prototype.getData = function(name, index_tx, search, func) {
      var request, store;
      store = this.db.transaction([], IDBTransaction.READ_ONLY).objectStore(name);
      request = store.index(index_tx).get(search);
      request.onsuccess = __bind(function(event) {
        return func(event.target.result);
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
