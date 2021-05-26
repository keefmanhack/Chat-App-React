import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyBy7pqMAcR7oRLnbqa1LSBlrEL52oXIP9Q",
    authDomain: "chat-app-c0e27.firebaseapp.com",
    projectId: "chat-app-c0e27",
    storageBucket: "chat-app-c0e27.appspot.com",
    messagingSenderId: "72330048291",
    appId: "1:72330048291:web:112f2f3bf6ca116768d296"
}

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();