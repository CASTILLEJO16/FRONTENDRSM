// src/services/auth.js
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";

export const registerFirebase = async (email, password, nombre) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  // opcional: definir displayName
  if (nombre) await updateProfile(userCred.user, { displayName: nombre });
  return userCred;
};

export const loginFirebase = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutFirebase = () => signOut(auth);

export const subscribeAuth = (callback) => onAuthStateChanged(auth, callback);
