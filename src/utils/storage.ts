interface User {
  id: string;
  username: string;
  password: string; // Store hashed password
  email: string;
  fullName: string;
  createdAt: Date;
  vocabularies: Vocabulary[];
}

interface Vocabulary {
  id: string;
  word: string;
  meaning: string;
  example: string;
  createdAt: Date;
}

class LocalStorageManager {
  private static instance: LocalStorageManager;
  private currentUserId: string | null = null;

  private constructor() {
    // Load current user from localStorage
    this.currentUserId = localStorage.getItem('currentUserId');
  }

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  // User management
  public createUser(username: string, password: string, email: string, fullName: string): User {
    const userId = Date.now().toString();
    const newUser: User = {
      id: userId,
      username,
      password: this.hashPassword(password), // Hash password before storing
      email,
      fullName,
      createdAt: new Date(),
      vocabularies: []
    };
    
    const users = this.getAllUsers();
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    this.setCurrentUser(userId);
    return newUser;
  }

  public login(username: string, password: string): User | null {
    const users = this.getAllUsers();
    const user = users.find(u => u.username === username && this.verifyPassword(password, u.password));
    
    if (user) {
      this.setCurrentUser(user.id);
      return user;
    }
    return null;
  }

  public setCurrentUser(userId: string): void {
    this.currentUserId = userId;
    localStorage.setItem('currentUserId', userId);
  }

  public getCurrentUser(): User | null {
    if (!this.currentUserId) {
      localStorage.removeItem('currentUserId');
      return null;
    }
    const user = this.getUserById(this.currentUserId);
    if (!user) {
      localStorage.removeItem('currentUserId');
      this.currentUserId = null;
    }
    return user;
  }

  public getUserById(userId: string): User | null {
    const users = this.getAllUsers();
    return users.find(user => user.id === userId) || null;
  }

  public getAllUsers(): User[] {
    const usersJson = localStorage.getItem('users');
    if (!usersJson) return [];
    
    const users = JSON.parse(usersJson);
    // Convert string dates back to Date objects
    return users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      vocabularies: user.vocabularies.map((vocab: any) => ({
        ...vocab,
        createdAt: new Date(vocab.createdAt)
      }))
    }));
  }

  // Simple password hashing (in a real app, use a proper hashing library)
  private hashPassword(password: string): string {
    return btoa(password); // This is just for demonstration, use proper hashing in production
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }

  // Vocabulary management
  public addVocabulary(vocabulary: Omit<Vocabulary, 'id'>): Vocabulary {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No current user');

    const newVocabulary: Vocabulary = {
      ...vocabulary,
      id: Date.now().toString()
    };

    user.vocabularies.push(newVocabulary);
    this.updateUser(user);

    return newVocabulary;
  }

  public deleteVocabulary(vocabularyId: string): void {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No current user');

    user.vocabularies = user.vocabularies.filter(v => v.id !== vocabularyId);
    this.updateUser(user);
  }

  public getVocabularies(): Vocabulary[] {
    const user = this.getCurrentUser();
    if (!user) return [];
    return user.vocabularies;
  }

  private updateUser(updatedUser: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
}

export const storage = LocalStorageManager.getInstance();
export type { User, Vocabulary }; 