let firebaseDB,fsRef;const initFirebase=a=>{const b=require("./../secrets.json");a.initializeApp(b.dbkeys.deploy),[firebaseDB,fsRef]=[a.firestore(),a.firestore]},cRef=(()=>{function getFirebaseRef(a){let b=firebaseDB;console.assert("string"==typeof a[0]),b=a[0].includes("/")?b.collectionGroup(a[0]):b.collection(a[0]);for(let c of a.slice(1))if("string"==typeof c){if(b instanceof fsRef.DocumentReference)b=b.collection(c);else if(b instanceof fsRef.Query)b=b.doc(c);else throw new Error("Unknown reference",b.toString());}else if(Array.isArray(c)){if(b instanceof fsRef.Query)b=b.where(...c);else throw new Error("Cannot query with",c.toString());console.assert(b instanceof fsRef.Query)}else throw new Error("Cannot parse",c.toString());return b}async function cachedRead(c){const d=JSON.stringify(c);if(!a.has(d)){const e=getFirebaseRef(c);a.set(d,e.get()),b.set(d,e.onSnapshot({error:console.trace,next:b=>{a.set(d,b)}}))}return await a.get(d)}const a=new Map,b=new Map;return function cacheRef(...a){return Object.assign(getFirebaseRef(a),{get:()=>cachedRead(a)})}})();module.exports={__init__:initFirebase,cRef};