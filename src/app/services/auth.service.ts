import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, createUserWithEmailAndPassword, deleteUser, updatePassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { Observable, map, switchMap } from 'rxjs';
import { User } from '../models/user.model';

// Helper function to convert Firestore Timestamp objects to JavaScript Date objects
function convertTimestamps(data: any): any {
  if (data && typeof data === 'object') {
    const converted = { ...data };
    
    // Convert createdAt if it's a Timestamp
    if (converted.createdAt && converted.createdAt instanceof Timestamp) {
      converted.createdAt = converted.createdAt.toDate();
    }
    
    return converted;
  }
  return data;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.user$ = user(this.auth);
  }

  async login(username: string, password: string): Promise<{ needsPasswordChange: boolean }> {
    try {
      // First find the user by username to get their email
      const userData = await this.findUserByUsername(username);
      if (!userData) {
        throw new Error('Gebruiker niet gevonden');
      }
      
      // Check if user needs Firebase Auth account creation
      if (userData.needsAuthAccount) {
        console.log('Creating Firebase Auth account for user:', username);
        
        // Create the Firebase Auth account
        const userCredential = await createUserWithEmailAndPassword(this.auth, userData.email || '', password);
        console.log('Firebase Auth user created:', userCredential.user.uid);
        
        // Update the Firestore document with the real UID and remove the flag
        const userRef = doc(this.firestore, 'users', username);
        await setDoc(userRef, {
          ...userData,
          uid: userCredential.user.uid,
          needsAuthAccount: false
        }, { merge: true });
        
        console.log('User Firebase Auth account created and document updated');
      } else {
        // Normal login with existing Firebase Auth account
        await signInWithEmailAndPassword(this.auth, userData.email || '', password);
      }
      
      // Check if user needs to change password
      if (userData.needsPasswordChange) {
        console.log('User needs to change password');
        return { needsPasswordChange: true };
      }
      
      return { needsPasswordChange: false };
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData: { username: string; password: string; email?: string; displayName?: string; role: 'admin' | 'user' }): Promise<void> {
    try {
      console.log('Creating user:', userData.username);
      
      // Check if username already exists
      const existingUser = await this.findUserByUsername(userData.username);
      if (existingUser) {
        throw new Error('Gebruikersnaam bestaat al');
      }

      // Create a unique email from username if not provided
      // Use timestamp and random string to ensure uniqueness
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substr(2, 9);
      const email = userData.email || `${userData.username}_${timestamp}_${randomString}@example.com`;
      console.log('Using unique email:', email);
      
      // First create the Firebase Authentication user
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, userData.password);
      console.log('Firebase Auth user created:', userCredential.user.uid);
      
      // Then create the user document in Firestore
      const userRef = doc(this.firestore, 'users', userData.username);
      const userDoc = {
        username: userData.username,
        email: email,
        displayName: userData.displayName || userData.username,
        role: userData.role,
        createdAt: new Date(),
        uid: userCredential.user.uid
      };
      
      console.log('Creating Firestore document:', userDoc);
      await setDoc(userRef, userDoc);
      console.log('User created successfully');
      
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async createUserAsAdmin(userData: { username: string; password: string; email?: string; displayName?: string; role: 'admin' | 'user' }): Promise<void> {
    try {
      console.log('Creating user as admin:', userData.username);
      
      // Check if username already exists
      const existingUser = await this.findUserByUsername(userData.username);
      if (existingUser) {
        throw new Error('Gebruikersnaam bestaat al');
      }

      // Create a unique email from username if not provided
      // Use timestamp and random string to ensure uniqueness
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substr(2, 9);
      const email = userData.email || `${userData.username}_${timestamp}_${randomString}@example.com`;
      console.log('Using unique email:', email);
      
      // Generate a unique UID for the new user (we'll use a timestamp + random string)
      const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create the user document in Firestore only (no Firebase Auth user)
      const userRef = doc(this.firestore, 'users', userData.username);
      const userDoc = {
        username: userData.username,
        email: email,
        displayName: userData.displayName || userData.username,
        role: userData.role,
        createdAt: new Date(),
        uid: uid,
        // Add a flag to indicate this user needs Firebase Auth account creation
        needsAuthAccount: true,
        // Add a flag to indicate this user needs to change password on first login
        needsPasswordChange: true
      };
      
      console.log('Creating Firestore document:', userDoc);
      await setDoc(userRef, userDoc);
      console.log('User created successfully as admin - Firestore document only');
      
      // Note: The Firebase Auth user will be created when the user first tries to log in
      // This way the admin stays logged in and can continue working
      
    } catch (error) {
      console.error('Error creating user as admin:', error);
      throw error;
    }
  }

  private async findUserByUsername(username: string): Promise<User | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { ...doc.data(), uid: doc.id } as User;
    }
    return null;
  }

  getUserData(uid: string): Observable<User | null> {
    const userRef = doc(this.firestore, 'users', uid);
    return new Observable(observer => {
      getDoc(userRef).then(doc => {
        if (doc.exists()) {
          observer.next({ uid, ...doc.data() } as User);
        } else {
          observer.next(null);
        }
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  getUserDataByUsername(username: string): Observable<User | null> {
    return new Observable(observer => {
      this.findUserByUsername(username).then(user => {
        observer.next(user);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  getCurrentUserData(): Observable<User | null> {
    return this.user$.pipe(
      switchMap(user => {
        if (user) {
          // Find user by email first, then by username
          return this.getUserDataByEmail(user.email || '');
        }
        return new Observable<User | null>(observer => {
          observer.next(null);
          observer.complete();
        });
      })
    );
  }

  getUserDataByEmail(email: string): Observable<User | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    
    return new Observable(observer => {
      getDocs(q).then(querySnapshot => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          observer.next({ ...doc.data(), uid: doc.id } as User);
        } else {
          observer.next(null);
        }
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  isAdmin(): Observable<boolean> {
    return this.getCurrentUserData().pipe(
      map(user => user?.role === 'admin' || false)
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user)
    );
  }

  async deleteUser(username: string): Promise<void> {
    try {
      console.log('Deleting user:', username);
      
      // First find the user by username to get their data
      const userData = await this.findUserByUsername(username);
      if (!userData) {
        throw new Error('Gebruiker niet gevonden');
      }

      // Delete the Firestore document first
      const userRef = doc(this.firestore, 'users', username);
      await deleteDoc(userRef);
      console.log('Firestore document deleted');

      // Note: We cannot delete Firebase Auth users from the client side for security reasons
      // The Firebase Auth user will remain but won't be able to log in since the Firestore document is gone
      // In a production environment, you would typically handle this through a Cloud Function
      
      console.log('User deleted successfully');
      
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      console.log('Changing password for current user');
      
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('Geen gebruiker ingelogd');
      }

      // Re-authenticate user with current password
      await signInWithEmailAndPassword(this.auth, currentUser.email || '', currentPassword);
      
      // Update password in Firebase Auth
      await updatePassword(currentUser, newPassword);
      console.log('Password updated in Firebase Auth');
      
      // Update user document to remove needsPasswordChange flag
      const userData = await this.getCurrentUserData().toPromise();
      if (userData) {
        const userRef = doc(this.firestore, 'users', userData.username);
        await setDoc(userRef, {
          needsPasswordChange: false
        }, { merge: true });
        console.log('User document updated - password change flag removed');
      }
      
      console.log('Password changed successfully');
      
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  async changePasswordFirstTime(newPassword: string): Promise<void> {
    try {
      console.log('Changing password for first time');
      
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('Geen gebruiker ingelogd');
      }

      // Update password in Firebase Auth (no re-authentication needed for first time)
      await updatePassword(currentUser, newPassword);
      console.log('Password updated in Firebase Auth');
      
      // Find user data by email and update the needsPasswordChange flag
      const userData = await this.getUserDataByEmail(currentUser.email || '').toPromise();
      if (userData) {
        const userRef = doc(this.firestore, 'users', userData.username);
        await setDoc(userRef, {
          needsPasswordChange: false
        }, { merge: true });
        console.log('User document updated - password change flag removed');
      } else {
        console.error('User data not found for email:', currentUser.email);
        throw new Error('Gebruikersgegevens niet gevonden');
      }
      
      console.log('Password changed successfully');
      
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  getAllUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    
    return new Observable(observer => {
      getDocs(usersRef).then(querySnapshot => {
        const users: User[] = [];
        querySnapshot.forEach(doc => {
          const userData = convertTimestamps(doc.data());
          // Include both the document ID (username) and the Firebase Auth UID from the document data
          users.push({ 
            ...userData, 
            username: doc.id, // Document ID is the username
            uid: userData.uid // Firebase Auth UID from document data
          } as User);
        });
        observer.next(users);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }
} 