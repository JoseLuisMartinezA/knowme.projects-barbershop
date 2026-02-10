
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'];

const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!privateKey && process.env.NODE_ENV === 'production') {
    console.warn('Missing GOOGLE_PRIVATE_KEY');
}

const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    privateKey,
    SCOPES
);

const calendar = google.calendar({ version: 'v3', auth });

/**
 * List events for a specific time range to check availability.
 */
export async function listEvents(timeMin: string, timeMax: string) {
    try {
        const response = await calendar.events.list({
            calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: 'startTime',
        });
        return response.data.items || [];
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        return [];
    }
}

/**
 * Create a new event on the calendar.
 */
export async function createEvent(resource: any) {
    try {
        const response = await calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
            requestBody: resource,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw error;
    }
}
