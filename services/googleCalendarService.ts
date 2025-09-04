
import { Appointment } from '../types';

const CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

// Maps a Google Calendar event item to our application's Appointment type.
const mapGoogleEventToAppointment = (item: any): Appointment => {
    // Google Calendar API returns 'date' for all-day events and 'dateTime' for timed events.
    const eventDate = item.start.dateTime || item.start.date;
    
    // Attempt to find a category from the event color or default to 'Other'
    let category: Appointment['category'] = 'Other';
    if(item.colorId){
        // A simple mapping from colorId to our categories. This can be expanded.
        const colorMap: {[key: string]: Appointment['category']} = {
            '1': 'Personal', // Lavender
            '2': 'Health',   // Sage
            '5': 'Work'      // Yellow
        };
        category = colorMap[item.colorId] || 'Other';
    }

    return {
        id: item.id,
        title: item.summary || 'No Title',
        date: new Date(eventDate).toISOString(),
        attendees: item.attendees?.map((a: any) => a.displayName || a.email) || [],
        description: item.description,
        category: category,
    };
};

// Fetches the next 20 upcoming events from the user's primary calendar.
export const listUpcomingEvents = async (accessToken: string): Promise<Appointment[]> => {
    const now = new Date().toISOString();
    const response = await fetch(
        `${CALENDAR_API_URL}?timeMin=${now}&maxResults=20&singleEvents=true&orderBy=startTime`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Failed to parse error response from Google Calendar API.' } }));
        const message = errorData.error?.message || 'Failed to fetch calendar events.';
        const error: any = new Error(message);
        error.status = response.status;
        throw error;
    }

    const data = await response.json();
    return data.items ? data.items.map(mapGoogleEventToAppointment) : [];
};

// Creates a new event in the user's primary calendar.
export const createCalendarEvent = async (
    accessToken: string,
    details: { title: string; date: string; attendees: string[] }
): Promise<Appointment> => {
    const eventStartTime = new Date(details.date);
    // Assume a 1-hour duration for simplicity.
    const eventEndTime = new Date(eventStartTime.getTime() + 60 * 60 * 1000);

    const eventResource = {
        summary: details.title,
        start: {
            dateTime: eventStartTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
            dateTime: eventEndTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        // For now, attendees are added to the description as we may not have their emails.
        description: `Appointment with: ${details.attendees.join(', ')}`,
        // We could add real attendees here if we collect their emails
        // attendees: details.attendees.map(email => ({ email })),
    };

    const response = await fetch(CALENDAR_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventResource),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Failed to parse error response from Google Calendar API.' } }));
        const message = errorData.error?.message || 'Failed to create calendar event.';
        const error: any = new Error(message);
        error.status = response.status;
        throw error;
    }

    const createdEvent = await response.json();
    return mapGoogleEventToAppointment(createdEvent);
};