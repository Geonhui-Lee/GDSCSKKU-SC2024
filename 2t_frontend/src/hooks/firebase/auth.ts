import { firebaseAuth } from "hooks/firebase/core";

export function isLoggedIn(): boolean {
    return firebaseAuth.currentUser ? true : false;
}