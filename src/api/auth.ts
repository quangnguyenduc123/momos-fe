interface User {
    username: string;
    password: string;
    token: string;
}

const mockUsers: User[] = [
    { username: 'admin', password: 'admin123', token: 'fake-jwt-token-admin' },
    { username: 'user', password: 'user123', token: 'fake-jwt-token-user' },
];

export const login = async (username: string, password: string): Promise<string> => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('token', user.token);
        return user.token;
    }
    throw new Error('Invalid credentials');
};

export const logout = (): void => {
    localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
};  