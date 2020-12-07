import firebase from 'firebase/app'
// import 'firebase/firebase-storage'
import 'firebase/auth';
export const firebaseConfig = {
    apiKey: "AIzaSyBfOyV62NimDFoCQR5kmcmvyBANFFUJITs",
    authDomain: "creante-ro.firebaseapp.com",
    projectId: "creante-ro",
    storageBucket: "creante-ro.appspot.com",
    messagingSenderId: "1071424795658",
    appId: "1:1071424795658:web:2439f1176d99598b139bf3"
};
firebase.initializeApp(firebaseConfig);
// export const db = firebase.firestore();
// export const storage = firebase.storage().ref()
export const auth = firebase.auth()
