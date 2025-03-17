import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
} from "firebase/auth";

export const doCreateUserWithEmailAndDisplayName = async (
    email: string,
    password: string,
    displayName: string
) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL: null, 
        createdAt: new Date(),
    });

    return user;
};

export const doSignInWithEmailAndPassword = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    //   const result = await signInWithPopup(auth, provider);
    //   const user = result.user;

    // add user to firestore
};

export const doSignOut = async () => {
    await auth.signOut();
};

export const doPasswordReset = (email: string) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password: string) => {
    if (auth.currentUser) {
        return updatePassword(auth.currentUser, password);
    } else {
        throw new Error("No user is currently signed in");
    }
};

export const doSendEmailVerification = () => {
    if (auth.currentUser) {
        return sendEmailVerification(auth.currentUser, {
            url: `${window.location.origin}/`,
        });
    } else {
        throw new Error("No user is currently signed in");
    }
};

export const updateUserProfileImage = async (photoURL: string) => {
    if (!auth.currentUser) throw new Error("Aucun utilisateur connecté");

    await updateProfile(auth.currentUser, { photoURL });

    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { photoURL });
};
