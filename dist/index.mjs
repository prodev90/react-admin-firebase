import{CREATE as e,DELETE as r,DELETE_MANY as t,GET_LIST as n,GET_MANY as o,GET_MANY_REFERENCE as i,GET_ONE as a,UPDATE as s,UPDATE_MANY as u}from"react-admin";import c from"path-browserify";import"firebase/firestore";import"firebase/storage";import l from"firebase/app";import"firebase/auth";function p(e,r,t){e.sort(function(e,n){var o,i,a=e[r],s=n[r];return Number.isFinite(a)&&Number.isFinite(s)?(o=a,i=s):(o=(e[r]||"").toString().toLowerCase(),i=(n[r]||"").toString().toLowerCase()),o>i?"asc"===t?1:-1:o<i?"asc"===t?-1:1:0})}var d=function(){this.title="🔥r-a-f: "},f={log:{configurable:!0},warn:{configurable:!0},error:{configurable:!0}};d.prototype.isEnabled=function(){return!!localStorage.getItem("LOGGING_ENABLED")},f.log.get=function(){return this.isEnabled()?console.log.bind(console,this.title):function(){for(var e=[],r=arguments.length;r--;)e[r]=arguments[r]}},f.warn.get=function(){return this.isEnabled()?console.warn.bind(console,this.title):function(){for(var e=[],r=arguments.length;r--;)e[r]=arguments[r]}},f.error.get=function(){return this.isEnabled()?console.error.bind(console,this.title):function(){for(var e=[],r=arguments.length;r--;)e[r]=arguments[r]}},Object.defineProperties(d.prototype,f);var h=new d;function m(e,r){e&&e.debug||r.logging?localStorage.setItem("LOGGING_ENABLED","true"):localStorage.removeItem("LOGGING_ENABLED")}var v=h.log,g=h.error;function y(e,r){if(!e)return r;if(!r)throw new Error("Resource name must be a string of length greater than 0 characters");var t=c.join("/",e,"/",r,"/");if((t.split("/").length-1)%2)throw new Error('The rootRef path must point to a "document" not a "collection"\ne.g. /collection/document/ or /collection/document/collection/document/');return t.slice(1,-1)}function P(e,r){try{var t=e()}catch(e){return r(e)}return t&&t.then?t.then(void 0,r):t}"undefined"!=typeof Symbol&&(Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"))),"undefined"!=typeof Symbol&&(Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")));var b=function(e,r){this.fireWrapper=e,this.options=r,this.resources={},this.db=e.db()};b.prototype.GetResource=function(e){var r=this.resources[e];if(!r)throw new Error('react-admin-firebase: Cant find resource: "'+e+'"');return r},b.prototype.TryGetResourcePromise=function(e,r){try{var t=this;return v("resourceManager.TryGetResourcePromise",{relativePath:e,collectionQuery:r}),Promise.resolve(t.initPath(e,r)).then(function(){var r=t.resources[e];if(!r)throw new Error('react-admin-firebase: Cant find resource: "'+e+'"');return r})}catch(e){return Promise.reject(e)}},b.prototype.RefreshResource=function(e,r){try{var t=this;return v("resourceManager.RefreshResource",{relativePath:e,collectionQuery:r}),Promise.resolve(t.initPath(e,r)).then(function(){var n=t.resources[e],o=n.collection,i=t.applyQuery(o,r);return Promise.resolve(i.get()).then(function(e){n.list=e.docs.map(function(e){return t.parseFireStoreDocument(e)}),v("resourceManager.RefreshResource",{newDocs:e,resource:n,collectionPath:o.path})})})}catch(e){return Promise.reject(e)}},b.prototype.GetSingleDoc=function(e,r){try{var t=this;return Promise.resolve(t.initPath(e)).then(function(){var n=t.resources[e];return Promise.resolve(n.collection.doc(r).get()).then(function(o){if(!o.exists)throw new Error("react-admin-firebase: No id found matching: "+r);var i=t.parseFireStoreDocument(o);return v("resourceManager.GetSingleDoc",{relativePath:e,resource:n,docId:r,docSnap:o,result:i}),i})})}catch(e){return Promise.reject(e)}},b.prototype.initPath=function(e,r){try{var t=this,n=y(t.options.rootRef,e);return Promise.resolve(t.isCollectionAccessible(n,r)).then(function(r){var o=!!t.resources[e];if(v("resourceManager.initPath()",{absolutePath:n,isAccessible:r,hasBeenInited:o}),!r&&o)return v("resourceManager.initPath() not accessible, removing resource..."),void t.removeResource(e);if(o)v("resourceManager.initPath() has been initialized already...");else{var i=t.db.collection(n),a={collection:i,list:[],path:e,pathAbsolute:n};t.resources[e]=a,v("resourceManager.initPath() setting resource...",{resource:a,allResources:t.resources,collection:i,collectionPath:i.path})}})}catch(e){return Promise.reject(e)}},b.prototype.parseFireStoreDocument=function(e){var r=e.data();return Object.keys(r).forEach(function(e){var t=r[e];t&&t.toDate&&t.toDate instanceof Function&&(r[e]=t.toDate())}),Object.assign({},{id:e.id},r)},b.prototype.getUserLogin=function(){try{var e=this;return new Promise(function(r,t){e.fireWrapper.auth().onAuthStateChanged(function(e){r(e)})})}catch(e){return Promise.reject(e)}},b.prototype.isCollectionAccessible=function(e,r){try{var t=!1,n=this,o=P(function(){var t=n.db.collection(e),o=n.applyQuery(t,r);return Promise.resolve(o.limit(1).get()).then(function(){})},function(){return t=!0,!1});return o&&o.then?o.then(function(e){return!t||e}):!t||o}catch(e){return Promise.reject(e)}},b.prototype.removeResource=function(e){delete this.resources[e]},b.prototype.applyQuery=function(e,r){var t;return t=r?r(e):e,v("resourceManager.applyQuery() ...",{collection:e,collectionQuery:(r||"-").toString(),collref:t}),t};var R=function(e,r){this.fireWrapper=e,this.options=r,this.db=e.db(),this.rm=new b(this.fireWrapper,this.options)};R.prototype.apiGetList=function(e,r){try{v("apiGetList",{resourceName:e,params:r});var t=r.filter.collectionQuery;return delete r.filter.collectionQuery,Promise.resolve(this.tryGetResource(e,"REFRESH",t)).then(function(e){var t=e.list;if(null!=r.sort){var n=r.sort;p(t,n.field,"ASC"===n.order?"asc":"desc")}var o=function(e,r){if(!(t=r)||"{}"===JSON.stringify(t))return e;var t,n=Object.keys(r).map(function(e){return{name:e,value:(r[e]||"").toLowerCase()}});return e.filter(function(e){return n.reduce(function(r,t){return function(e,r,n){var o=e[t.name];return"string"==typeof o&&o.toString().toLowerCase().includes(n.toLowerCase())}(e,0,t.value)&&r},!0)})}(t,r.filter),i=(r.pagination.page-1)*r.pagination.perPage;return{data:o.slice(i,i+r.pagination.perPage),total:o.length}})}catch(e){return Promise.reject(e)}},R.prototype.apiGetOne=function(e,r){try{var t=this;return v("apiGetOne",{resourceName:e,params:r}),P(function(){return Promise.resolve(t.rm.GetSingleDoc(e,r.id)).then(function(e){return{data:e}})},function(){throw new Error("Error getting id: "+r.id+" from collection: "+e)})}catch(e){return Promise.reject(e)}},R.prototype.apiCreate=function(e,r){try{var t=this;return Promise.resolve(t.tryGetResource(e)).then(function(n){var o=!1;function i(e){if(o)return e;var i=t.db.collection("collections").doc().id;return Promise.resolve(t.parseDataAndUpload(n,i,r.data)).then(function(e){var r=Object.assign({},e);return t.checkRemoveIdField(r),Promise.resolve(t.addCreatedByFields(r)).then(function(){return Promise.resolve(t.addUpdatedByFields(r)).then(function(){return Promise.resolve(n.collection.doc(i).set(r,{merge:!1})).then(function(){return{data:Object.assign({},e,{id:i})}})})})})}v("apiCreate",{resourceName:e,resource:n,params:r});var a=r.data&&r.data.id;v("apiCreate",{hasOverridenDocId:a});var s=function(){if(a){var e=r.data.id;return Promise.resolve(n.collection.doc(e).get()).then(function(i){if(i.exists)throw new Error('the id:"'+e+"\" already exists, please use a unique string if overriding the 'id' field");return Promise.resolve(t.parseDataAndUpload(n,e,r.data)).then(function(r){if(!e)throw new Error("id must be a valid string");var i=Object.assign({},r);return t.checkRemoveIdField(i),Promise.resolve(t.addCreatedByFields(i)).then(function(){return Promise.resolve(t.addUpdatedByFields(i)).then(function(){return v("apiCreate",{docObj:i}),Promise.resolve(n.collection.doc(e).set(i,{merge:!1})).then(function(){return o=!0,{data:Object.assign({},r,{id:e})}})})})})})}}();return s&&s.then?s.then(i):i(s)})}catch(e){return Promise.reject(e)}},R.prototype.apiUpdate=function(e,r){try{var t=this,n=r.id;return delete r.data.id,Promise.resolve(t.tryGetResource(e)).then(function(o){return v("apiUpdate",{resourceName:e,resource:o,params:r}),Promise.resolve(t.parseDataAndUpload(o,n,r.data)).then(function(e){var r=Object.assign({},e);return t.checkRemoveIdField(r),Promise.resolve(t.addUpdatedByFields(r)).then(function(){return o.collection.doc(n).update(r).catch(function(e){g("apiUpdate error",{error:e})}),{data:Object.assign({},e,{id:n})}})})})}catch(e){return Promise.reject(e)}},R.prototype.apiUpdateMany=function(e,r){try{var t=this;return delete r.data.id,Promise.resolve(t.tryGetResource(e)).then(function(n){return v("apiUpdateMany",{resourceName:e,resource:n,params:r}),Promise.resolve(Promise.all(r.ids.map(function(e){try{return Promise.resolve(t.parseDataAndUpload(n,e,r.data)).then(function(r){var o=Object.assign({},r);return t.checkRemoveIdField(o),Promise.resolve(t.addUpdatedByFields(o)).then(function(){return n.collection.doc(e).update(o).catch(function(e){g("apiUpdateMany error",{error:e})}),Object.assign({},r,{id:e})})})}catch(e){return Promise.reject(e)}}))).then(function(e){return{data:e}})})}catch(e){return Promise.reject(e)}},R.prototype.apiDelete=function(e,r){try{return Promise.resolve(this.tryGetResource(e)).then(function(t){return v("apiDelete",{resourceName:e,resource:t,params:r}),t.collection.doc(r.id).delete().catch(function(e){g("apiDelete error",{error:e})}),{data:r.previousData}})}catch(e){return Promise.reject(e)}},R.prototype.apiDeleteMany=function(e,r){try{var t=this;return Promise.resolve(t.tryGetResource(e)).then(function(n){v("apiDeleteMany",{resourceName:e,resource:n,params:r});for(var o=[],i=t.db.batch(),a=0,s=r.ids;a<s.length;a+=1){var u=s[a];i.delete(n.collection.doc(u)),o.push({id:u})}return i.commit().catch(function(e){g("apiDeleteMany error",{error:e})}),{data:o}})}catch(e){return Promise.reject(e)}},R.prototype.apiGetMany=function(e,r){try{return Promise.resolve(this.tryGetResource(e,"REFRESH")).then(function(t){return v("apiGetMany",{resourceName:e,resource:t,params:r}),Promise.resolve(Promise.all(r.ids.map(function(e){return t.collection.doc(e).get()}))).then(function(e){return{data:e.map(function(e){return Object.assign({},e.data(),{id:e.id})})}})})}catch(e){return Promise.reject(e)}},R.prototype.apiGetManyReference=function(e,r){try{return Promise.resolve(this.tryGetResource(e,"REFRESH")).then(function(t){v("apiGetManyReference",{resourceName:e,resource:t,params:r});var n=r.target,o=r.id,i=t.list.filter(function(e){return e[n]===o});if(null!=r.sort){var a=r.sort;p(i,a.field,"ASC"===a.order?"asc":"desc")}var s=(r.pagination.page-1)*r.pagination.perPage;return{data:i.slice(s,s+r.pagination.perPage),total:i.length}})}catch(e){return Promise.reject(e)}},R.prototype.tryGetResource=function(e,r,t){try{var n=this;function o(){return n.rm.TryGetResourcePromise(e,t)}var i=function(){if(r)return Promise.resolve(n.rm.RefreshResource(e,t)).then(function(){})}();return i&&i.then?i.then(o):o()}catch(e){return Promise.reject(e)}},R.prototype.getCurrentUserEmail=function(){try{return Promise.resolve(this.rm.getUserLogin()).then(function(e){return e?e.email:"annonymous user"})}catch(e){return Promise.reject(e)}},R.prototype.parseDataAndUpload=function(e,r,t){try{var n=this;if(!t)return t;var o=e.collection.doc(r).path;return Promise.resolve(Promise.all(Object.keys(t).map(function(e){try{function r(){return Promise.resolve(n.parseDataField(i,o,e)).then(function(){})}var i=t[e],a=Array.isArray(i),s=function(){if(a)return Promise.resolve(Promise.all(i.map(function(r,t){return i[t]&&i[t].hasOwnProperty("rawFile")?Promise.all([n.parseDataField(i[t],o,e+t)]):Promise.all(Object.keys(r).map(function(i){return n.parseDataField(r[i],o,e+i+t)}))}))).then(function(){})}();return Promise.resolve(s&&s.then?s.then(r):r())}catch(e){return Promise.reject(e)}}))).then(function(){return t})}catch(e){return Promise.reject(e)}},R.prototype.checkRemoveIdField=function(e){this.options.dontAddIdFieldToDoc&&delete e.id},R.prototype.addCreatedByFields=function(e){try{var r=this;if(r.options.disableMeta)return;return Promise.resolve(r.getCurrentUserEmail()).then(function(t){e.createdate=r.fireWrapper.serverTimestamp(),e.createdby=t})}catch(e){return Promise.reject(e)}},R.prototype.addUpdatedByFields=function(e){try{var r=this;if(r.options.disableMeta)return;return Promise.resolve(r.getCurrentUserEmail()).then(function(t){e.lastupdate=r.fireWrapper.serverTimestamp(),e.updatedby=t})}catch(e){return Promise.reject(e)}},R.prototype.parseDataField=function(e,r,t){try{if(!e||!e.hasOwnProperty("rawFile"))return;return Promise.resolve(this.uploadAndGetLink(e.rawFile,r,t)).then(function(r){e.src=r,delete e.rawFile})}catch(e){return Promise.reject(e)}},R.prototype.uploadAndGetLink=function(e,r,t){try{var n=c.join(r,t);return Promise.resolve(this.saveFile(n,e))}catch(e){return Promise.reject(e)}},R.prototype.saveFile=function(e,r){try{v("saveFile() saving file...",{storagePath:e,rawFile:r});var t=this.fireWrapper.storage().ref(e).put(r);return P(function(){return Promise.resolve(new Promise(function(e,r){return t.then(e).catch(r)})).then(function(r){return Promise.resolve(r.ref.getDownloadURL()).then(function(t){return v("saveFile() saved file",{storagePath:e,taskResult:r,getDownloadURL:t}),t})})},function(e){g("storage/unknown"===e.code?'saveFile() error saving file, No bucket found! Try clicking "Get Started" in firebase -> storage':"saveFile() error saving file",{storageError:e})})}catch(e){return Promise.reject(e)}};var G,w=function(){};function j(c,l){var p=l||{};!function(e,r){if(!(e||r&&r.app))throw new Error("Please pass the Firebase firebaseConfig object or options.app to the FirebaseAuthProvider");r.rootRef&&y(r.rootRef,"test")}(c,p),m(c,p),v("react-admin-firebase:: Creating FirebaseDataProvider",{firebaseConfig:c,options:p});var d=new w;return d.init(c,l),G=new R(d,p),function(c,l,p){try{switch(v("FirebaseDataProvider: event",{type:c,resourceName:l,params:p}),c){case o:return Promise.resolve(G.apiGetMany(l,p));case i:return Promise.resolve(G.apiGetManyReference(l,p));case n:return Promise.resolve(G.apiGetList(l,p));case a:return Promise.resolve(G.apiGetOne(l,p));case e:return Promise.resolve(G.apiCreate(l,p));case s:return Promise.resolve(G.apiUpdate(l,p));case u:return Promise.resolve(G.apiUpdateMany(l,p));case r:return Promise.resolve(G.apiDelete(l,p));case t:return Promise.resolve(G.apiDeleteMany(l,p));default:return Promise.resolve({})}}catch(e){return Promise.reject(e)}}}w.prototype.init=function(e,r){this.app=function(e,r){return r.app?r.app:l.apps.length?l.app():l.initializeApp(e)}(e,r),this.firestore=this.app.firestore()},w.prototype.db=function(){return this.firestore},w.prototype.serverTimestamp=function(){return new Date},w.prototype.auth=function(){return this.app.auth()},w.prototype.storage=function(){return this.app.storage()};var A=function(e,r){var t=r||{};v("Auth Client: initializing...",{firebaseConfig:e,options:t});var n=new w;n.init(e,t),this.auth=n.auth(),this.setPersistence(t.persistence)};function T(e,r){!function(e,r){if(!(e||r&&r.app))throw new Error("Please pass the Firebase firebaseConfig object or options.app to the FirebaseAuthProvider")}(e,r);var t=new A(e,r);return m(e,r),{login:function(e){return t.HandleAuthLogin(e)},logout:function(){return t.HandleAuthLogout()},checkAuth:function(){return t.HandleAuthCheck()},checkError:function(e){return t.HandleAuthError(e)},getPermissions:function(){return t.HandleGetPermissions()},getJWTAuthTime:function(){return t.HandleGetJWTAuthTime()},getJWTExpirationTime:function(){return t.HandleGetJWTExpirationTime()},getJWTSignInProvider:function(){return t.HandleGetJWTSignInProvider()},getJWTClaims:function(){return t.HandleGetPermissions()},getJWTToken:function(){return t.HandleGetJWTToken()}}}A.prototype.setPersistence=function(e){var r;switch(e){case"local":r=l.auth.Auth.Persistence.LOCAL;break;case"none":r=l.auth.Auth.Persistence.NONE;break;case"session":default:r=l.auth.Auth.Persistence.SESSION}v("setPersistence",{persistenceInput:e,persistenceResolved:r}),this.auth.setPersistence(r).catch(function(e){return console.error(e)})},A.prototype.HandleAuthLogin=function(e){try{var r=this,t=e.username,n=e.password;return t&&n?P(function(){return Promise.resolve(r.auth.signInWithEmailAndPassword(t,n)).then(function(e){return v("HandleAuthLogin: user sucessfully logged in",{user:e}),e})},function(){throw v("HandleAuthLogin: invalid credentials",{params:e}),new Error("Login error: invalid credentials")}):r.getUserLogin()}catch(e){return Promise.reject(e)}},A.prototype.HandleAuthLogout=function(){return this.auth.signOut()},A.prototype.HandleAuthError=function(e){return v("HandleAuthLogin: invalid credentials",{error:e}),Promise.reject("Login error: invalid credentials")},A.prototype.HandleAuthCheck=function(){return this.getUserLogin()},A.prototype.getUserLogin=function(){var e=this;return new Promise(function(r,t){if(e.auth.currentUser)return r(e.auth.currentUser);var n=e.auth.onAuthStateChanged(function(e){n(),e?r(e):t()})})},A.prototype.HandleGetPermissions=function(){try{var e=this;return P(function(){return Promise.resolve(e.getUserLogin()).then(function(e){return Promise.resolve(e.getIdTokenResult()).then(function(e){return e.claims})})},function(e){return v("HandleGetPermission: no user is logged in or tokenResult error",{e:e}),null})}catch(e){return Promise.reject(e)}},A.prototype.HandleGetJWTAuthTime=function(){try{var e=this;return P(function(){return Promise.resolve(e.getUserLogin()).then(function(e){return Promise.resolve(e.getIdTokenResult()).then(function(e){return e.authTime})})},function(e){return v("HandleGetJWTAuthTime: no user is logged in or tokenResult error",{e:e}),null})}catch(e){return Promise.reject(e)}},A.prototype.HandleGetJWTExpirationTime=function(){try{var e=this;return P(function(){return Promise.resolve(e.getUserLogin()).then(function(e){return Promise.resolve(e.getIdTokenResult()).then(function(e){return e.expirationTime})})},function(e){return v("HandleGetJWTExpirationTime: no user is logged in or tokenResult error",{e:e}),null})}catch(e){return Promise.reject(e)}},A.prototype.HandleGetJWTSignInProvider=function(){try{var e=this;return P(function(){return Promise.resolve(e.getUserLogin()).then(function(e){return Promise.resolve(e.getIdTokenResult()).then(function(e){return e.signInProvider})})},function(e){return v("HandleGetJWTSignInProvider: no user is logged in or tokenResult error",{e:e}),null})}catch(e){return Promise.reject(e)}},A.prototype.HandleGetJWTIssuedAtTime=function(){try{var e=this;return P(function(){return Promise.resolve(e.getUserLogin()).then(function(e){return Promise.resolve(e.getIdTokenResult()).then(function(e){return e.issuedAtTime})})},function(e){return v("HandleGetJWTIssuedAtTime: no user is logged in or tokenResult error",{e:e}),null})}catch(e){return Promise.reject(e)}},A.prototype.HandleGetJWTToken=function(){try{var e=this;return P(function(){return Promise.resolve(e.getUserLogin()).then(function(e){return Promise.resolve(e.getIdTokenResult()).then(function(e){return e.token})})},function(e){return v("HandleGetJWTIssuedAtTime: no user is logged in or tokenResult error",{e:e}),null})}catch(e){return Promise.reject(e)}};export{j as FirebaseDataProvider,T as FirebaseAuthProvider};
//# sourceMappingURL=index.mjs.map
