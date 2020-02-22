import{CREATE as e,DELETE as r,DELETE_MANY as t,GET_LIST as n,GET_MANY as o,GET_MANY_REFERENCE as i,GET_ONE as a,UPDATE as s,UPDATE_MANY as u}from"react-admin";import c from"path-browserify";import{firestore as l,apps as p,app as f,initializeApp as h}from"firebase/app";import"firebase/firestore";import"firebase/auth";import"firebase/storage";function m(e,r){v&&console.log("react-admin-firebase: ",e,r)}function d(e,r){v&&console.error("react-admin-firebase: ",e,r)}var v=!1;function y(e,r){(e&&e.debug||r.logging)&&(v=!0)}function P(e,r){try{var t=e()}catch(e){return r(e)}return t&&t.then?t.then(void 0,r):t}function g(e,r){if(!e)return r;if(!r)throw new Error("Resource name must be a string of length greater than 0 characters");var t=c.join("/",e,"/",r,"/");if((t.split("/").length-1)%2)throw new Error('The rootRef path must point to a "document" not a "collection"\ne.g. /collection/document/ or /collection/document/collection/document/');return t.slice(1,-1)}"undefined"!=typeof Symbol&&(Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"))),"undefined"!=typeof Symbol&&(Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")));var b=function(e,r){this.fireWrapper=e,this.options=r,this.resources={},this.db=e.db()};function w(e,r,t){e.sort(function(e,n){var o,i,a=e[r],s=n[r];return Number.isFinite(a)&&Number.isFinite(s)?(o=a,i=s):(o=(e[r]||"").toString().toLowerCase(),i=(n[r]||"").toString().toLowerCase()),o>i?"asc"===t?1:-1:o<i?"asc"===t?-1:1:0})}b.prototype.GetResource=function(e){var r=this.resources[e];if(!r)throw new Error('react-admin-firebase: Cant find resource: "'+e+'"');return r},b.prototype.TryGetResourcePromise=function(e,r){try{var t=this;return m("resourceManager.TryGetResourcePromise",{relativePath:e,collectionQuery:r}),Promise.resolve(t.initPath(e,r)).then(function(){var r=t.resources[e];if(!r)throw new Error('react-admin-firebase: Cant find resource: "'+e+'"');return r})}catch(e){return Promise.reject(e)}},b.prototype.RefreshResource=function(e,r){try{var t=this;return m("resourceManager.RefreshResource",{relativePath:e,collectionQuery:r}),Promise.resolve(t.initPath(e,r)).then(function(){var n=t.resources[e],o=t.applyQuery(n.collection,r);return Promise.resolve(o.get()).then(function(e){n.list=e.docs.map(function(e){return t.parseFireStoreDocument(e)})})})}catch(e){return Promise.reject(e)}},b.prototype.GetSingleDoc=function(e,r){try{var t=this;return Promise.resolve(t.initPath(e)).then(function(){return Promise.resolve(t.resources[e].collection.doc(r).get()).then(function(e){if(!e.exists)throw new Error("react-admin-firebase: No id found matching: "+r);return t.parseFireStoreDocument(e)})})}catch(e){return Promise.reject(e)}},b.prototype.initPath=function(e,r){try{var t=this,n=g(t.options.rootRef,e);return m("resourceManager.initPath:::",{absolutePath:n}),Promise.resolve(t.isCollectionAccessible(n,r)).then(function(r){var o=!!t.resources[e];if(m("resourceManager.initPath:::",{absolutePath:n,isAccessible:r,hasBeenInited:o}),r||!o){if(!o){var i=t.db.collection(n);t.resources[e]={collection:i,list:[],path:e,pathAbsolute:n}}}else t.removeResource(e)})}catch(e){return Promise.reject(e)}},b.prototype.parseFireStoreDocument=function(e){var r=e.data();return Object.keys(r).forEach(function(e){var t=r[e];t&&t.toDate&&t.toDate instanceof Function&&(r[e]=t.toDate())}),Object.assign({},{id:e.id},r)},b.prototype.getUserLogin=function(){try{var e=this;return new Promise(function(r,t){e.fireWrapper.auth().onAuthStateChanged(function(e){r(e)})})}catch(e){return Promise.reject(e)}},b.prototype.isCollectionAccessible=function(e,r){try{var t=!1,n=this,o=P(function(){var t=n.db.collection(e),o=n.applyQuery(t,r);return Promise.resolve(o.limit(1).get()).then(function(){})},function(){return t=!0,!1});return o&&o.then?o.then(function(e){return!t||e}):!t||o}catch(e){return Promise.reject(e)}},b.prototype.removeResource=function(e){delete this.resources[e]},b.prototype.applyQuery=function(e,r){return r?r(e):e};var j=function(e,r){this.fireWrapper=e,this.options=r,this.db=e.db(),this.rm=new b(this.fireWrapper,this.options)};j.prototype.apiGetList=function(e,r){try{m("apiGetList",{resourceName:e,params:r});var t=r.filter.collectionQuery;return delete r.filter.collectionQuery,Promise.resolve(this.tryGetResource(e,"REFRESH",t)).then(function(e){var t=e.list;if(null!=r.sort){var n=r.sort;w(t,n.field,"ASC"===n.order?"asc":"desc")}var o=function(e,r){if(!(t=r)||"{}"===JSON.stringify(t))return e;var t,n=Object.keys(r);return e.filter(function(e){return n.reduce(function(t,n){var o=r[n];null!=o&&null!=o||(o="");var i=o.toString().toLowerCase(),a=e[n];if(null==a)return!1;var s=a.toString().toLowerCase().includes(i);return t||s},!1)})}(t,r.filter),i=(r.pagination.page-1)*r.pagination.perPage;return{data:o.slice(i,i+r.pagination.perPage),total:e.list.length}})}catch(e){return Promise.reject(e)}},j.prototype.apiGetOne=function(e,r){try{var t=this;return m("apiGetOne",{resourceName:e,params:r}),P(function(){return Promise.resolve(t.rm.GetSingleDoc(e,r.id)).then(function(e){return{data:e}})},function(){throw new Error("Error getting id: "+r.id+" from collection: "+e)})}catch(e){return Promise.reject(e)}},j.prototype.apiCreate=function(e,r){try{var t=this;return Promise.resolve(t.tryGetResource(e)).then(function(n){return m("apiCreate",{resourceName:e,resource:n,params:r}),Promise.resolve(t.getCurrentUserEmail()).then(function(e){var o=!1;function i(i){if(o)return i;var a=t.db.collection("collections").doc().id;return Promise.resolve(t.parseDataAndUpload(n,a,r.data)).then(function(r){var o=Object.assign({},r,{createdate:t.fireWrapper.serverTimestamp(),lastupdate:t.fireWrapper.serverTimestamp(),createdby:e,updatedby:e});return Promise.resolve(n.collection.doc(a).set(o,{merge:!1})).then(function(){return{data:Object.assign({},r,{id:a})}})})}var a=r.data&&r.data.id,s=function(){if(a){var i=r.data.id;return Promise.resolve(t.parseDataAndUpload(n,i,r.data)).then(function(r){if(!i)throw new Error("id must be a valid string");var a=Object.assign({},r,{createdate:t.fireWrapper.serverTimestamp(),lastupdate:t.fireWrapper.serverTimestamp(),createdby:e,updatedby:e});return Promise.resolve(n.collection.doc(i).set(a,{merge:!0})).then(function(){return o=!0,{data:Object.assign({},r,{id:i})}})})}}();return s&&s.then?s.then(i):i(s)})})}catch(e){return Promise.reject(e)}},j.prototype.apiUpdate=function(e,r){try{var t=this,n=r.id;return delete r.data.id,Promise.resolve(t.tryGetResource(e)).then(function(o){return m("apiUpdate",{resourceName:e,resource:o,params:r}),Promise.resolve(t.getCurrentUserEmail()).then(function(e){return Promise.resolve(t.parseDataAndUpload(o,n,r.data)).then(function(r){return o.collection.doc(n).update(Object.assign({},r,{lastupdate:t.fireWrapper.serverTimestamp(),updatedby:e})).catch(function(e){d("apiUpdate error",{error:e})}),{data:Object.assign({},r,{id:n})}})})})}catch(e){return Promise.reject(e)}},j.prototype.apiUpdateMany=function(e,r){try{var t=this;return delete r.data.id,Promise.resolve(t.tryGetResource(e)).then(function(n){m("apiUpdateMany",{resourceName:e,resource:n,params:r});var o=r.ids;return Promise.resolve(t.getCurrentUserEmail()).then(function(e){return Promise.resolve(Promise.all(o.map(function(o){try{return Promise.resolve(t.parseDataAndUpload(n,o,r.data)).then(function(r){return n.collection.doc(o).update(Object.assign({},r,{lastupdate:t.fireWrapper.serverTimestamp(),updatedby:e})).catch(function(e){d("apiUpdateMany error",{error:e})}),Object.assign({},r,{id:o})})}catch(e){return Promise.reject(e)}}))).then(function(e){return{data:e}})})})}catch(e){return Promise.reject(e)}},j.prototype.apiDelete=function(e,r){try{return Promise.resolve(this.tryGetResource(e)).then(function(t){return m("apiDelete",{resourceName:e,resource:t,params:r}),t.collection.doc(r.id).delete().catch(function(e){d("apiDelete error",{error:e})}),{data:r.previousData}})}catch(e){return Promise.reject(e)}},j.prototype.apiDeleteMany=function(e,r){try{var t=this;return Promise.resolve(t.tryGetResource(e)).then(function(n){m("apiDeleteMany",{resourceName:e,resource:n,params:r});for(var o=[],i=t.db.batch(),a=0,s=r.ids;a<s.length;a+=1){var u=s[a];i.delete(n.collection.doc(u)),o.push({id:u})}return i.commit().catch(function(e){d("apiDeleteMany error",{error:e})}),{data:o}})}catch(e){return Promise.reject(e)}},j.prototype.apiGetMany=function(e,r){try{return Promise.resolve(this.tryGetResource(e,"REFRESH")).then(function(t){return m("apiGetMany",{resourceName:e,resource:t,params:r}),Promise.resolve(Promise.all(r.ids.map(function(e){return t.collection.doc(e).get()}))).then(function(e){return{data:e.map(function(e){return Object.assign({},e.data(),{id:e.id})})}})})}catch(e){return Promise.reject(e)}},j.prototype.apiGetManyReference=function(e,r){try{return Promise.resolve(this.tryGetResource(e,"REFRESH")).then(function(t){m("apiGetManyReference",{resourceName:e,resource:t,params:r});var n=t.list,o=r.target,i=r.id,a=n.filter(function(e){return e[o]===i});if(null!=r.sort){var s=r.sort;w(n,s.field,"ASC"===s.order?"asc":"desc")}var u=(r.pagination.page-1)*r.pagination.perPage;return{data:a.slice(u,u+r.pagination.perPage),total:a.length}})}catch(e){return Promise.reject(e)}},j.prototype.tryGetResource=function(e,r,t){try{var n=this;function o(){return n.rm.TryGetResourcePromise(e,t)}var i=function(){if(r)return Promise.resolve(n.rm.RefreshResource(e,t)).then(function(){})}();return i&&i.then?i.then(o):o()}catch(e){return Promise.reject(e)}},j.prototype.getCurrentUserEmail=function(){try{return Promise.resolve(this.rm.getUserLogin()).then(function(e){return e?e.email:"annonymous user"})}catch(e){return Promise.reject(e)}},j.prototype.parseDataAndUpload=function(e,r,t){try{var n=this;if(!t)return t;var o=e.collection.doc(r).path;return Promise.resolve(Promise.all(Object.keys(t).map(function(e){try{function r(){return Promise.resolve(n.parseDataField(i,o,e)).then(function(){})}var i=t[e],a=Array.isArray(i),s=function(){if(a)return Promise.resolve(Promise.all(i.map(function(r,t){return i[t]&&i[t].hasOwnProperty("rawFile")?Promise.all([n.parseDataField(i[t],o,e+t)]):Promise.all(Object.keys(r).map(function(i){return n.parseDataField(r[i],o,e+i+t)}))}))).then(function(){})}();return Promise.resolve(s&&s.then?s.then(r):r())}catch(e){return Promise.reject(e)}}))).then(function(){return t})}catch(e){return Promise.reject(e)}},j.prototype.parseDataField=function(e,r,t){try{if(!e||!e.hasOwnProperty("rawFile"))return;return Promise.resolve(this.uploadAndGetLink(e.rawFile,r,t)).then(function(r){e.src=r,delete e.rawFile})}catch(e){return Promise.reject(e)}},j.prototype.uploadAndGetLink=function(e,r,t){try{var n=c.join(r,t);return Promise.resolve(this.saveFile(n,e))}catch(e){return Promise.reject(e)}},j.prototype.saveFile=function(e,r){try{m("saveFile() saving file...",{storagePath:e,rawFile:r});var t=this.fireWrapper.storage().ref(e).put(r);return P(function(){return Promise.resolve(new Promise(function(e,r){return t.then(e).catch(r)})).then(function(r){return Promise.resolve(r.ref.getDownloadURL()).then(function(t){return m("saveFile() saved file",{storagePath:e,taskResult:r,getDownloadURL:t}),t})})},function(e){d("storage/unknown"===e.code?'saveFile() error saving file, No bucket found! Try clicking "Get Started" in firebase -> storage':"saveFile() error saving file",{storageError:e})})}catch(e){return Promise.reject(e)}};var R,A=function(){};function F(c,l){var p=l||{};!function(e,r){if(!(e||r&&r.app))throw new Error("Please pass the Firebase firebaseConfig object or options.app to the FirebaseAuthProvider");r.rootRef&&g(r.rootRef,"test")}(c,p),y(c,p),m("react-admin-firebase:: Creating FirebaseDataProvider",{firebaseConfig:c,options:p});var f=new A;return f.init(c,l),R=new j(f,p),function(c,l,p){try{switch(m("FirebaseDataProvider: event",{type:c,resourceName:l,params:p}),c){case o:return Promise.resolve(R.apiGetMany(l,p));case i:return Promise.resolve(R.apiGetManyReference(l,p));case n:return Promise.resolve(R.apiGetList(l,p));case a:return Promise.resolve(R.apiGetOne(l,p));case e:return Promise.resolve(R.apiCreate(l,p));case s:return Promise.resolve(R.apiUpdate(l,p));case u:return Promise.resolve(R.apiUpdateMany(l,p));case r:return Promise.resolve(R.apiDelete(l,p));case t:return Promise.resolve(R.apiDeleteMany(l,p));default:return Promise.resolve({})}}catch(e){return Promise.reject(e)}}}A.prototype.init=function(e,r){this.app=function(e,r){return r.app?r.app:p.length?f():h(e)}(e,r),this.firestore=this.app.firestore()},A.prototype.db=function(){return this.firestore},A.prototype.serverTimestamp=function(){return l.FieldValue.serverTimestamp()},A.prototype.auth=function(){return this.app.auth()},A.prototype.storage=function(){return this.app.storage()};var G=function(e,r){var t=r||{};m("Auth Client: initializing...",{firebaseConfig:e,options:t});var n=new A;n.init(e,t),this.auth=n.auth()};function D(e,r){!function(e,r){if(!(e||r&&r.app))throw new Error("Please pass the Firebase firebaseConfig object or options.app to the FirebaseAuthProvider")}(e,r);var t=new G(e,r);return y(e,r),{login:function(e){return t.HandleAuthLogin(e)},logout:function(){return t.HandleAuthLogout()},checkAuth:function(){return t.HandleAuthCheck()},checkError:function(e){return t.HandleAuthError(e)},getPermissions:function(){return t.HandleGetPermissions()}}}G.prototype.HandleAuthLogin=function(e){try{var r=this,t=e.username,n=e.password;return t&&n?P(function(){return Promise.resolve(r.auth.signInWithEmailAndPassword(t,n)).then(function(e){return m("HandleAuthLogin: user sucessfully logged in",{user:e}),e})},function(){throw m("HandleAuthLogin: invalid credentials",{params:e}),new Error("Login error: invalid credentials")}):r.getUserLogin()}catch(e){return Promise.reject(e)}},G.prototype.HandleAuthLogout=function(){return this.auth.signOut()},G.prototype.HandleAuthError=function(e){return m("HandleAuthLogin: invalid credentials",{error:e}),Promise.reject("Login error: invalid credentials")},G.prototype.HandleAuthCheck=function(){return this.getUserLogin()},G.prototype.getUserLogin=function(){var e=this;return new Promise(function(r,t){if(e.auth.currentUser)return r(e.auth.currentUser);var n=e.auth.onAuthStateChanged(function(e){n(),e?r(e):t()})})},G.prototype.HandleGetPermissions=function(){try{var e=this;return P(function(){return Promise.resolve(e.getUserLogin()).then(function(e){return Promise.resolve(e.getIdTokenResult()).then(function(e){return e.claims})})},function(e){return m("HandleGetPermission: no user is logged in or tokenResult error",{e:e}),null})}catch(e){return Promise.reject(e)}};export{F as FirebaseDataProvider,D as FirebaseAuthProvider};
//# sourceMappingURL=index.mjs.map
