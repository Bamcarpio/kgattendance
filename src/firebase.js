import { initializeApp } from "firebase/app"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD8nJtZhCD8JGZbYU0qOW4oO4fA8ttWq5Q",
    authDomain: "kg--inventory.firebaseapp.com",
    databaseURL: "https://kg--inventory-default-rtdb.firebaseio.com",
    projectId: "kg--inventory",
    storageBucket: "kg--inventory.firebasestorage.app",
    messagingSenderId: "551630662329",
    appId: "1:551630662329:web:2fae4020669ca60ffbc968",
    measurementId: "G-PLH6MEDJMN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const registerUser = async (username, password, name, address, contactNumber, jobPosition) => {
  const email = `${username}@kennethgads.com`;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Determine if the user is an admin
    const isAdmin = username === "admin.kgads" && password === "kgads123";

    // Save user details in the database
    await set(ref(db, `users/${user.uid}`), {
      username,
      name,
      address,
      contactNumber,
      jobPosition,
      isAdmin, // Store if the user is an admin
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const loginUser = async (username, password) => {
  const email = `${username}@kennethgads.com`;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Retrieve user details from Firebase
    const userRef = ref(db, `users/${userCredential.user.uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.exists() ? snapshot.val() : null;

    return { success: true, user: userCredential.user, userData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export { auth, db, registerUser, loginUser };
