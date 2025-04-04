import axios from "axios";

const MAX_RETRIES = 3; // Maximum number of retry attempts
const RETRY_DELAY = 1000; // Delay between retries in milliseconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (username: string, password: string): Promise<string> => {
    let attempts = 0;
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:80/'; 
    while (attempts < MAX_RETRIES) {
        try {
            const response = await axios.post(`${baseUrl}auth/login`, {
                username,
                password,
            });
            const { data } = response;
            const { accessToken } = data;
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                return accessToken;
            }
            throw new Error('Invalid credentials');
        } catch (error) {
            console.log(error)
            attempts++;
            if (attempts >= MAX_RETRIES) {
                throw new Error('Login failed after multiple attempts');
            }
            await delay(RETRY_DELAY); // Wait before retrying
        }
    }

    throw new Error('Unexpected error'); // Fallback error
};

export const logout = (): void => {
    localStorage.removeItem('accessToken');
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('accessToken');
};  