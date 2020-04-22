import firebase from 'firebase/app'
import 'firebase/firebase-storage'
import 'firebase/auth';
export var firebaseConfig = {
    apiKey: "AIzaSyAdiKABuTH3BKfs1wiHGaiFfhTF8dN0kHM",
    authDomain: "test-2157a.firebaseapp.com",
    databaseURL: "https://test-2157a.firebaseio.com",
    projectId: "test-2157a",
    storageBucket: "test-2157a.appspot.com",
    messagingSenderId: "1093757144531",
    appId: "1:1093757144531:web:054090d66ea2647125f326",
    measurementId: "G-L7P29CNC8X"
};
firebase.initializeApp(firebaseConfig);
// export const db = firebase.firestore();
export const storage = firebase.storage().ref()
export const auth = firebase.auth()
