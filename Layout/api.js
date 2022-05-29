import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1aurusIi2LjDMJPhx1ZrZgXVZtVjT_SQ",
  authDomain: "mouz-calendar.firebaseapp.com",
  projectId: "mouz-calendar",
  storageBucket: "mouz-calendar.appspot.com",
  messagingSenderId: "796507857180",
  appId: "1:796507857180:web:d8d8f47e5a05bd22e1dad9",
  measurementId: "G-JBSKE0HSXJ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export const signUpWithEmail = async (loginEmail, loginPassword) => {
  if (!loginEmail.trim()) return;

  await createUserWithEmailAndPassword(auth, loginEmail, loginPassword).catch(
    (error) => {
      alert(error.message);
    }
  );
};

export const monitorAuthState = async (callback) =>
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef)
        .then((doc) => {
          if (!doc.data()) {
            setDoc(docRef, { events: [] });
          }
        })
        .finally(() =>
          getDoc(docRef).then((doc) => {
            callback({
              events: doc.data().events ?? [],
              id: user.uid,
              name: user.email,
            });
            console.log(doc.data().events);
          })
        );
    } else {
      callback({});
    }
  });

export const signInWithEmail = async (loginEmail, loginPassword) => {
  await signInWithEmailAndPassword(auth, loginEmail, loginPassword).catch(
    (error) => {
      alert(error.message);
    }
  );
};

export const signOutFromApp = async () => {
  await signOut(auth);
};

export const getIfLoggedIn = () => !!auth.currentUser;

export const fetchData = async (id, setData) => {
  const docRef = doc(db, "users", id);

  await getDoc(docRef).then((doc) => {
    if (doc.data()) {
      setData(doc.data().events);
    } else {
      setData(null);
    }
  });
};

export const backUpData = async (id, data) => {
  const docRef = doc(db, "users", id);
  await setDoc(docRef, { events: data });
};
