function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var r=e(require("ra-realtime")),t=e(require("path-browserify")),n=require("firebase/app");require("firebase/firestore"),require("firebase/auth"),require("firebase/storage");var o=require("react-admin");function i(e,r){s&&console.log("react-admin-firebase: ",e,r)}function a(e,r){s&&console.error("react-admin-firebase: ",e,r)}var s=!1;function u(e,r){(e&&e.debug||r.logging)&&(s=!0)}function c(e,r){try{var t=e()}catch(e){return r(e)}return t&&t.then?t.then(void 0,r):t}function l(e,r){if(!e)return r;if(!r)throw new Error("Resource name must be a string of length greater than 0 characters");var n=t.join("/",e,"/",r,"/");if((n.split("/").length-1)%2)throw new Error('The rootRef path must point to a "document" not a "collection"\ne.g. /collection/document/ or /collection/document/collection/document/');return n.slice(1,-1)}"undefined"!=typeof Symbol&&(Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"))),"undefined"!=typeof Symbol&&(Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")));var p=function(e,r){this.fireWrapper=e,this.options=r,this.resources={},this.db=e.db()};function f(e,r,t){e.sort(function(e,n){var o,i,a=e[r],s=n[r];return Number.isFinite(a)&&Number.isFinite(s)?(o=a,i=s):(o=(e[r]||"").toString().toLowerCase(),i=(n[r]||"").toString().toLowerCase()),o>i?"asc"===t?1:-1:o<i?"asc"===t?-1:1:0})}p.prototype.GetResource=function(e){var r=this.resources[e];if(!r)throw new Error('react-admin-firebase: Cant find resource: "'+e+'"');return r},p.prototype.TryGetResourcePromise=function(e,r){try{var t=this;return Promise.resolve(t.initPath(e,r)).then(function(){var r=t.resources[e];if(!r)throw new Error('react-admin-firebase: Cant find resource: "'+e+'"');return r})}catch(e){return Promise.reject(e)}},p.prototype.RefreshResource=function(e,r){try{var t=this;return Promise.resolve(t.initPath(e,r)).then(function(){var n=t.resources[e];i("resourceManager.RefreshResource",{relativePath:e});var o=t.applyQuery(n.collection,r);return Promise.resolve(o.get()).then(function(e){n.list=e.docs.map(function(e){return t.parseFireStoreDocument(e)})})})}catch(e){return Promise.reject(e)}},p.prototype.GetSingleDoc=function(e,r){try{var t=this;return Promise.resolve(t.initPath(e)).then(function(){return Promise.resolve(t.resources[e].collection.doc(r).get()).then(function(e){if(!e.exists)throw new Error("react-admin-firebase: No id found matching: "+r);return t.parseFireStoreDocument(e)})})}catch(e){return Promise.reject(e)}},p.prototype.initPath=function(e,r){try{var t=this,n=l(t.options.rootRef,e);return i("resourceManager.initPath:::",{absolutePath:n}),Promise.resolve(t.isCollectionAccessible(n,r)).then(function(r){var o=t.resources[e];if(r){if(!o){var i=t.db.collection(n);t.resources[e]={collection:i,list:[],path:e,pathAbsolute:n}}}else o&&t.removeResource(e)})}catch(e){return Promise.reject(e)}},p.prototype.parseFireStoreDocument=function(e){var r=e.data();return Object.keys(r).forEach(function(e){var t=r[e];t&&t.toDate&&t.toDate instanceof Function&&(r[e]=t.toDate())}),Object.assign({},{id:e.id},r)},p.prototype.getUserLogin=function(){try{var e=this;return new Promise(function(r,t){e.fireWrapper.auth().onAuthStateChanged(function(e){r(e)})})}catch(e){return Promise.reject(e)}},p.prototype.isCollectionAccessible=function(e,r){try{var t=!1,n=this,o=c(function(){var t=n.db.collection(e),o=n.applyQuery(t,r);return Promise.resolve(o.get()).then(function(){})},function(){return t=!0,!1});return o&&o.then?o.then(function(e){return!t||e}):!t||o}catch(e){return Promise.reject(e)}},p.prototype.removeResource=function(e){delete this.resources[e]},p.prototype.applyQuery=function(e,r){return r?r(e):e};var h=function(e,r){this.fireWrapper=e,this.options=r,this.db=e.db(),this.rm=new p(this.fireWrapper,this.options)};h.prototype.apiGetList=function(e,r){try{i("apiGetList",{resourceName:e,params:r});var t=r.filter.collectionQuery;return delete r.filter.collectionQuery,Promise.resolve(this.tryGetResource(e,"REFRESH",t)).then(function(e){var t=e.list;if(null!=r.sort){var n=r.sort;f(t,n.field,"ASC"===n.order?"asc":"desc")}var o=function(e,r){if(!(t=r)||"{}"===JSON.stringify(t))return e;var t,n=Object.keys(r);return e.filter(function(e){return n.reduce(function(t,n){var o=r[n];null!=o&&null!=o||(o="");var i=o.toString().toLowerCase(),a=e[n];if(null==a)return!1;var s=a.toString().toLowerCase().includes(i);return t||s},!1)})}(t,r.filter),i=(r.pagination.page-1)*r.pagination.perPage;return{data:o.slice(i,i+r.pagination.perPage),total:e.list.length}})}catch(e){return Promise.reject(e)}},h.prototype.apiGetOne=function(e,r){try{var t=this;return i("apiGetOne",{resourceName:e,params:r}),c(function(){return Promise.resolve(t.rm.GetSingleDoc(e,r.id)).then(function(e){return{data:e}})},function(){throw new Error("Error getting id: "+r.id+" from collection: "+e)})}catch(e){return Promise.reject(e)}},h.prototype.apiCreate=function(e,r){try{var t=this;return Promise.resolve(t.tryGetResource(e)).then(function(n){return i("apiCreate",{resourceName:e,resource:n,params:r}),Promise.resolve(t.getCurrentUserEmail()).then(function(e){var o=!1;function i(i){if(o)return i;var a=t.db.collection("collections").doc().id;return Promise.resolve(t.parseDataAndUpload(n,a,r.data)).then(function(r){var o=Object.assign({},r,{createdate:t.fireWrapper.serverTimestamp(),lastupdate:t.fireWrapper.serverTimestamp(),createdby:e,updatedby:e});return Promise.resolve(n.collection.doc(a).set(o,{merge:!1})).then(function(){return{data:Object.assign({},r,{id:a})}})})}var a=r.data&&r.data.id,s=function(){if(a){var i=r.data.id;return Promise.resolve(t.parseDataAndUpload(n,i,r.data)).then(function(r){if(!i)throw new Error("id must be a valid string");var a=Object.assign({},r,{createdate:t.fireWrapper.serverTimestamp(),lastupdate:t.fireWrapper.serverTimestamp(),createdby:e,updatedby:e});return Promise.resolve(n.collection.doc(i).set(a,{merge:!0})).then(function(){return o=!0,{data:Object.assign({},r,{id:i})}})})}}();return s&&s.then?s.then(i):i(s)})})}catch(e){return Promise.reject(e)}},h.prototype.apiUpdate=function(e,r){try{var t=this,n=r.id;return delete r.data.id,Promise.resolve(t.tryGetResource(e)).then(function(o){return i("apiUpdate",{resourceName:e,resource:o,params:r}),Promise.resolve(t.getCurrentUserEmail()).then(function(e){return Promise.resolve(t.parseDataAndUpload(o,n,r.data)).then(function(r){return o.collection.doc(n).update(Object.assign({},r,{lastupdate:t.fireWrapper.serverTimestamp(),updatedby:e})).catch(function(e){a("apiUpdate error",{error:e})}),{data:Object.assign({},r,{id:n})}})})})}catch(e){return Promise.reject(e)}},h.prototype.apiUpdateMany=function(e,r){try{var t=this;return delete r.data.id,Promise.resolve(t.tryGetResource(e)).then(function(n){i("apiUpdateMany",{resourceName:e,resource:n,params:r});var o=r.ids;return Promise.resolve(t.getCurrentUserEmail()).then(function(e){return Promise.resolve(Promise.all(o.map(function(o){try{return Promise.resolve(t.parseDataAndUpload(n,o,r.data)).then(function(r){return n.collection.doc(o).update(Object.assign({},r,{lastupdate:t.fireWrapper.serverTimestamp(),updatedby:e})).catch(function(e){a("apiUpdateMany error",{error:e})}),Object.assign({},r,{id:o})})}catch(e){return Promise.reject(e)}}))).then(function(e){return{data:e}})})})}catch(e){return Promise.reject(e)}},h.prototype.apiDelete=function(e,r){try{return Promise.resolve(this.tryGetResource(e)).then(function(t){return i("apiDelete",{resourceName:e,resource:t,params:r}),t.collection.doc(r.id).delete().catch(function(e){a("apiDelete error",{error:e})}),{data:r.previousData}})}catch(e){return Promise.reject(e)}},h.prototype.apiDeleteMany=function(e,r){try{var t=this;return Promise.resolve(t.tryGetResource(e)).then(function(n){i("apiDeleteMany",{resourceName:e,resource:n,params:r});for(var o=[],s=t.db.batch(),u=0,c=r.ids;u<c.length;u+=1){var l=c[u];s.delete(n.collection.doc(l)),o.push({id:l})}return s.commit().catch(function(e){a("apiDeleteMany error",{error:e})}),{data:o}})}catch(e){return Promise.reject(e)}},h.prototype.apiGetMany=function(e,r){try{return Promise.resolve(this.tryGetResource(e,"REFRESH")).then(function(t){return i("apiGetMany",{resourceName:e,resource:t,params:r}),Promise.resolve(Promise.all(r.ids.map(function(e){return t.collection.doc(e).get()}))).then(function(e){return{data:e.map(function(e){return Object.assign({},e.data(),{id:e.id})})}})})}catch(e){return Promise.reject(e)}},h.prototype.apiGetManyReference=function(e,r){try{return Promise.resolve(this.tryGetResource(e,"REFRESH")).then(function(t){i("apiGetManyReference",{resourceName:e,resource:t,params:r});var n=t.list,o=r.target,a=r.id,s=n.filter(function(e){return e[o]===a});if(null!=r.sort){var u=r.sort;f(n,u.field,"ASC"===u.order?"asc":"desc")}var c=(r.pagination.page-1)*r.pagination.perPage;return{data:s.slice(c,c+r.pagination.perPage),total:s.length}})}catch(e){return Promise.reject(e)}},h.prototype.tryGetResource=function(e,r,t){try{var n=this;function o(){return n.rm.TryGetResourcePromise(e,t)}var i=function(){if(r)return Promise.resolve(n.rm.RefreshResource(e,t)).then(function(){})}();return i&&i.then?i.then(o):o()}catch(e){return Promise.reject(e)}},h.prototype.getCurrentUserEmail=function(){try{return Promise.resolve(this.rm.getUserLogin()).then(function(e){return e?e.email:"annonymous user"})}catch(e){return Promise.reject(e)}},h.prototype.parseDataAndUpload=function(e,r,t){try{var n=this;if(!t)return t;var o=e.collection.doc(r).path;return Promise.resolve(Promise.all(Object.keys(t).map(function(e){try{function r(){return Promise.resolve(n.parseDataField(i,o,e)).then(function(){})}var i=t[e],a=Array.isArray(i),s=function(){if(a)return Promise.resolve(Promise.all(i.map(function(r,t){return i[t]&&i[t].hasOwnProperty("rawFile")?Promise.all([n.parseDataField(i[t],o,e+t)]):Promise.all(Object.keys(r).map(function(i){return n.parseDataField(r[i],o,e+i+t)}))}))).then(function(){})}();return Promise.resolve(s&&s.then?s.then(r):r())}catch(e){return Promise.reject(e)}}))).then(function(){return t})}catch(e){return Promise.reject(e)}},h.prototype.parseDataField=function(e,r,t){try{if(!e||!e.hasOwnProperty("rawFile"))return;return Promise.resolve(this.uploadAndGetLink(e.rawFile,r,t)).then(function(r){e.src=r,delete e.rawFile})}catch(e){return Promise.reject(e)}},h.prototype.uploadAndGetLink=function(e,r,n){try{var o=t.join(r,n);return Promise.resolve(this.saveFile(o,e))}catch(e){return Promise.reject(e)}},h.prototype.saveFile=function(e,r){try{i("saveFile() saving file...",{storagePath:e,rawFile:r});var t=this.fireWrapper.storage().ref(e).put(r);return c(function(){return Promise.resolve(new Promise(function(e,r){return t.then(e).catch(r)})).then(function(r){return Promise.resolve(r.ref.getDownloadURL()).then(function(t){return i("saveFile() saved file",{storagePath:e,taskResult:r,getDownloadURL:t}),t})})},function(e){a("storage/unknown"===e.code?'saveFile() error saving file, No bucket found! Try clicking "Get Started" in firebase -> storage':"saveFile() error saving file",{storageError:e})})}catch(e){return Promise.reject(e)}};var d,m=function(){};m.prototype.init=function(e,r){this.app=function(e,r){return r.app?r.app:n.apps.length?n.app():n.initializeApp(e)}(e,r),this.firestore=this.app.firestore()},m.prototype.db=function(){return this.firestore},m.prototype.serverTimestamp=function(){return n.firestore.FieldValue.serverTimestamp()},m.prototype.auth=function(){return this.app.auth()},m.prototype.storage=function(){return this.app.storage()};var v=function(e,r){var t=r||{};i("Auth Client: initializing...",{firebaseConfig:e,options:t});var n=new m;n.init(e,t),this.auth=n.auth()};v.prototype.HandleAuthLogin=function(e){try{var r=this,t=e.username,n=e.password;return c(function(){return Promise.resolve(r.auth.signInWithEmailAndPassword(t,n)).then(function(e){return i("HandleAuthLogin: user sucessfully logged in",{user:e}),e})},function(){throw i("HandleAuthLogin: invalid credentials",{params:e}),new Error("Login error: invalid credentials")})}catch(e){return Promise.reject(e)}},v.prototype.HandleAuthLogout=function(e){try{return Promise.resolve(this.auth.signOut()).then(function(){})}catch(e){return Promise.reject(e)}},v.prototype.HandleAuthError=function(e){},v.prototype.HandleAuthCheck=function(e){try{var r=this;return c(function(){return Promise.resolve(r.getUserLogin()).then(function(e){i("HandleAuthCheck: user is still logged in",{user:e})})},function(e){throw i("HandleAuthCheck: ",{e:e}),new Error("Auth check error: "+e)})}catch(e){return Promise.reject(e)}},v.prototype.getUserLogin=function(){try{var e=this;return new Promise(function(r,t){e.auth.onAuthStateChanged(function(e){e?r(e):t("User not logged in")})})}catch(e){return Promise.reject(e)}},v.prototype.HandleGetCurrent=function(){try{var e=this;return c(function(){return Promise.resolve(e.getUserLogin()).then(function(e){return i("HandleGetCurrent: current user",{user:e}),e})},function(e){return i("HandleGetCurrent: no user is logged in",{e:e}),null})}catch(e){return Promise.reject(e)}},v.prototype.HandleGetPermissions=function(){try{var e=this;return c(function(){return Promise.resolve(e.getUserLogin()).then(function(e){return Promise.resolve(e.getIdTokenResult()).then(function(e){return e.claims})})},function(e){return i("HandleGetPermission: no user is logged in or tokenResult error",{e:e}),null})}catch(e){return Promise.reject(e)}},exports.FirebaseRealTimeSaga=function(e,t){return r(function(e,r){return function(t,n,o){var i=r||{};if((!Array.isArray(i.watch)||i.watch.includes(n))&&(!Array.isArray(i.dontwatch)||!i.dontwatch.includes(n)))return{subscribe:function(r){return e(t,n,o).then(function(e){return r.next(e)}).catch(function(e){return r.error(e)}),{unsubscribe:function(){}}}}}}(e,t))},exports.FirebaseDataProvider=function(e,r){var t=r||{};!function(e,r){if(!(e||r&&r.app))throw new Error("Please pass the Firebase firebaseConfig object or options.app to the FirebaseAuthProvider");r.rootRef&&l(r.rootRef,"test")}(e,t),u(e,t),i("react-admin-firebase:: Creating FirebaseDataProvider",{firebaseConfig:e,options:t});var n=new m;return n.init(e,r),d=new h(n,t),function(e,r,t){try{switch(i("FirebaseDataProvider: event",{type:e,resourceName:r,params:t}),e){case o.GET_MANY:return Promise.resolve(d.apiGetMany(r,t));case o.GET_MANY_REFERENCE:return Promise.resolve(d.apiGetManyReference(r,t));case o.GET_LIST:return Promise.resolve(d.apiGetList(r,t));case o.GET_ONE:return Promise.resolve(d.apiGetOne(r,t));case o.CREATE:return Promise.resolve(d.apiCreate(r,t));case o.UPDATE:return Promise.resolve(d.apiUpdate(r,t));case o.UPDATE_MANY:return Promise.resolve(d.apiUpdateMany(r,t));case o.DELETE:return Promise.resolve(d.apiDelete(r,t));case o.DELETE_MANY:return Promise.resolve(d.apiDeleteMany(r,t));default:return Promise.resolve({})}}catch(e){return Promise.reject(e)}}},exports.FirebaseAuthProvider=function(e,r){!function(e,r){if(!(e||r&&r.app))throw new Error("Please pass the Firebase firebaseConfig object or options.app to the FirebaseAuthProvider")}(e,r);var t=new v(e,r);return u(e,r),function(e,r){try{switch(i("Auth Event: ",{type:e,params:r}),e){case o.AUTH_LOGIN:return Promise.resolve(t.HandleAuthLogin(r));case o.AUTH_LOGOUT:return Promise.resolve(t.HandleAuthLogout(r));case o.AUTH_ERROR:return Promise.resolve(t.HandleAuthError(r));case o.AUTH_CHECK:return Promise.resolve(t.HandleAuthCheck(r));case"AUTH_GETCURRENT":return Promise.resolve(t.HandleGetCurrent());case o.AUTH_GET_PERMISSIONS:return Promise.resolve(t.HandleGetPermissions());default:throw new Error("Unhandled auth type:"+e)}}catch(e){return Promise.reject(e)}}};
//# sourceMappingURL=index.js.map
