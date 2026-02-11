
import { createClient } from "@libsql/client";


const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Initialize the client only if we have the required parameters to avoid build-time crashes.
// Note: The app will still require these at runtime to function correctly.
export const db = createClient({
    url: url || 'https://placeholder-url-for-build.com',
    authToken: authToken || '',
});
