import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDummyKey123456789",
  authDomain: "ankfin-dummy.firebaseapp.com",
  projectId: "ankfin-dummy",
  storageBucket: "ankfin-dummy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
}

let app
let auth

if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
}

export { app, auth } 