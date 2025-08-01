export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
  date?: Date;
  createdBy: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  votes: Vote[];
}

export interface Vote {
  userId: string;
  vote: 'yes' | 'no';
  timestamp: Date;
}

export interface QuoteCreate {
  text: string;
  author: string;
  category?: string;
  date?: Date;
} 