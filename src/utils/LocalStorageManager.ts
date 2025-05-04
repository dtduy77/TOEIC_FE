export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export class LocalStorageManager {
  private users: User[];
  private currentUserId: string | null;

  constructor() {
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.currentUserId = localStorage.getItem('currentUserId');
  }

  createUser(username: string, password: string, email: string, fullName: string): boolean {
    if (this.users.some(user => user.username === username)) {
      return false;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      password,
      email,
      fullName
    };

    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUserId = user.id;
      localStorage.setItem('currentUserId', user.id);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserId = null;
    localStorage.removeItem('currentUserId');
  }

  getCurrentUser(): User | null {
    if (!this.currentUserId) return null;
    return this.users.find(user => user.id === this.currentUserId) || null;
  }

  getUserById(userId: string): User | null {
    return this.users.find(user => user.id === userId) || null;
  }

  updateUserDetails(userId: string, updates: Partial<Omit<User, 'id'>>): boolean {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) return false;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates
    };

    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }

  isLoggedIn(): boolean {
    return this.currentUserId !== null;
  }
}

// Create and export a singleton instance
export const storage = new LocalStorageManager(); 