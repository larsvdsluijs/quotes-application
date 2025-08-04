import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, Timestamp } from '@angular/fire/firestore';
import { Auth, user, authState } from '@angular/fire/auth';
import { Observable, map, switchMap, take } from 'rxjs';
import { Quote, QuoteCreate, Vote } from '../models/quote.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  user$;

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {
    this.user$ = authState(this.auth);
  }

  // Helper function to convert Firestore Timestamp to JavaScript Date
  private convertTimestamps(data: any): any {
    const converted = { ...data };
    
    // Convert createdAt if it's a Timestamp
    if (converted.createdAt && typeof converted.createdAt.toDate === 'function') {
      converted.createdAt = converted.createdAt.toDate();
    }
    
    // Convert date if it's a Timestamp
    if (converted.date && typeof converted.date.toDate === 'function') {
      converted.date = converted.date.toDate();
    }
    
    // Convert vote timestamps if they exist
    if (converted.votes && Array.isArray(converted.votes)) {
      converted.votes = converted.votes.map((vote: any) => ({
        ...vote,
        timestamp: vote.timestamp && typeof vote.timestamp.toDate === 'function' 
          ? vote.timestamp.toDate() 
          : vote.timestamp
      }));
    }
    
    return converted;
  }

  async addQuote(quoteData: QuoteCreate): Promise<void> {
    const user = await this.user$.pipe(take(1)).toPromise();
    if (!user) throw new Error('User not authenticated');

    // Create quote object without undefined fields
    const quoteDataClean = { ...quoteData };
    if (!quoteDataClean.date) {
      delete quoteDataClean.date;
    }

    const quote: Omit<Quote, 'id'> = {
      ...quoteDataClean,
      createdBy: user.uid || '',
      createdAt: new Date(),
      status: 'pending',
      votes: []
    };

    console.log('Adding quote to pending_quotes:', quote);
    await addDoc(collection(this.firestore, 'pending_quotes'), quote);
    console.log('Quote added successfully');
  }

  getPendingQuotes(): Observable<Quote[]> {
    const pendingQuotesRef = collection(this.firestore, 'pending_quotes');
    const q = query(pendingQuotesRef, orderBy('createdAt', 'desc'));

    return new Observable(observer => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const quotes: Quote[] = [];
        snapshot.forEach(doc => {
          const data = this.convertTimestamps(doc.data());
          quotes.push({ id: doc.id, ...data } as Quote);
        });
        observer.next(quotes);
      });

      return unsubscribe;
    });
  }

  getApprovedQuotes(): Observable<Quote[]> {
    const approvedQuotesRef = collection(this.firestore, 'quotes');
    const q = query(approvedQuotesRef, orderBy('createdAt', 'desc'));

    return new Observable(observer => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const quotes: Quote[] = [];
        snapshot.forEach(doc => {
          const data = this.convertTimestamps(doc.data());
          quotes.push({ id: doc.id, ...data } as Quote);
        });
        observer.next(quotes);
      });

      return unsubscribe;
    });
  }

  async voteOnQuote(quoteId: string, vote: 'yes' | 'no'): Promise<void> {
    const user = await this.user$.pipe(take(1)).toPromise();
    if (!user) throw new Error('User not authenticated');

    // Check if user is admin - admins cannot vote
    try {
      const userSnapshot = await getDocs(query(collection(this.firestore, 'users'), where('__name__', '==', user.uid)));
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        if (userData['role'] === 'admin') {
          throw new Error('Admins cannot vote on quotes');
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      throw new Error('Unable to verify user permissions');
    }

    console.log('Voting on quote:', quoteId, 'with vote:', vote, 'by user:', user.uid);

    try {
      // Get the quote document directly
      const quoteRef = doc(this.firestore, 'pending_quotes', quoteId);
      const quoteSnapshot = await getDocs(query(collection(this.firestore, 'pending_quotes'), where('__name__', '==', quoteId)));
      
      if (quoteSnapshot.empty) {
        console.error('Quote not found:', quoteId);
        throw new Error('Quote not found');
      }

      const rawData = quoteSnapshot.docs[0].data();
      const quoteData = this.convertTimestamps(rawData) as Quote;
      console.log('Current quote data:', quoteData);

      // Initialize votes array if it doesn't exist
      if (!quoteData.votes) {
        quoteData.votes = [];
      }

      // Check if user has already voted
      const existingVoteIndex = quoteData.votes.findIndex((v: any) => v.userId === user.uid);

      if (existingVoteIndex !== -1) {
        // Update existing vote
        quoteData.votes[existingVoteIndex].vote = vote;
        quoteData.votes[existingVoteIndex].timestamp = new Date();
        console.log('Updated existing vote');
      } else {
        // Add new vote
        quoteData.votes.push({
          userId: user.uid,
          vote,
          timestamp: new Date()
        });
        console.log('Added new vote');
      }

      // Check if quote should be approved or rejected
      const totalUsers = await this.getTotalUsers();
      
      // Filter votes to only count votes from regular users (not admins)
      const regularUserVotes = [];
      for (const vote of quoteData.votes) {
        try {
          // Get user data to check role
          const userSnapshot = await getDocs(query(collection(this.firestore, 'users'), where('__name__', '==', vote.userId)));
          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            if (userData['role'] === 'user') {
              regularUserVotes.push(vote); // Only count votes from regular users
            }
          }
        } catch (error) {
          console.error('Error checking user role for vote:', error);
        }
      }
      
      const yesVotes = regularUserVotes.filter((v: any) => v.vote === 'yes').length;
      const noVotes = regularUserVotes.filter((v: any) => v.vote === 'no').length;
      const approvalPercentage = totalUsers > 0 ? (yesVotes / totalUsers) * 100 : 0;
      const rejectionPercentage = totalUsers > 0 ? (noVotes / totalUsers) * 100 : 0;

      console.log('Vote stats (regular users only):', { yesVotes, noVotes, totalUsers, approvalPercentage, rejectionPercentage });

      if (approvalPercentage >= 50) {
        // Move to approved quotes
        console.log('Quote approved, moving to quotes collection');
        await addDoc(collection(this.firestore, 'quotes'), {
          ...quoteData,
          status: 'approved'
        });
        // Remove from pending
        await deleteDoc(quoteRef);
        console.log('Quote moved to approved and removed from pending');
      } else if (rejectionPercentage >= 50) {
        // Quote rejected, remove from pending
        console.log('Quote rejected, removing from pending');
        await deleteDoc(quoteRef);
        console.log('Quote rejected and removed from pending');
      } else {
        // Update votes in pending quote
        console.log('Updating votes in pending quote');
        await updateDoc(quoteRef, { votes: quoteData.votes });
        console.log('Votes updated successfully');
      }
    } catch (error) {
      console.error('Error in voteOnQuote:', error);
      throw error;
    }
  }

  private async getTotalUsers(): Promise<number> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const snapshot = await getDocs(usersRef);
      
      // Filter to only count users with role 'user' (exclude admins)
      const regularUsers = snapshot.docs.filter(doc => {
        const userData = doc.data();
        return userData['role'] === 'user';
      });
      
      console.log('Total regular users (excluding admins):', regularUsers.length);
      return regularUsers.length;
    } catch (error) {
      console.error('Error getting total users:', error);
      // Return a default value to prevent errors
      return 1;
    }
  }

  async getTotalUsersCount(): Promise<number> {
    return this.getTotalUsers();
  }

  async getUserById(userId: string): Promise<any> {
    try {
      const userSnapshot = await getDocs(query(collection(this.firestore, 'users'), where('__name__', '==', userId)));
      if (!userSnapshot.empty) {
        return userSnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  getAllUsers(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');

    return new Observable(observer => {
      const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const users: any[] = [];
        snapshot.forEach(doc => {
          users.push({ id: doc.id, ...doc.data() });
        });
        observer.next(users);
      });

      return unsubscribe;
    });
  }

  async deleteQuote(quoteId: string, collection: 'pending_quotes' | 'quotes' = 'quotes'): Promise<void> {
    try {
      const quoteRef = doc(this.firestore, collection, quoteId);
      await deleteDoc(quoteRef);
      console.log(`Quote ${quoteId} deleted from ${collection}`);
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
  }

  async updateQuote(quote: Quote): Promise<void> {
    try {
      console.log('Updating quote:', quote.id);
      
      // First, delete the quote from the approved quotes collection
      const approvedQuoteRef = doc(this.firestore, 'quotes', quote.id);
      await deleteDoc(approvedQuoteRef);
      console.log('Quote removed from approved quotes');
      
      // Then, add it back to pending quotes with updated data and reset votes
      const updatedQuote = {
        ...quote,
        votes: [], // Reset votes since it's going back to pending
        status: 'pending'
      };
      
      // Remove the id field since we're creating a new document
      const { id, ...quoteData } = updatedQuote;
      
      await addDoc(collection(this.firestore, 'pending_quotes'), quoteData);
      console.log('Quote moved back to pending quotes');
      
    } catch (error) {
      console.error('Error updating quote:', error);
      throw error;
    }
  }
} 