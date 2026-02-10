
import { addMinutes, areIntervalsOverlapping, format, getDay, isSameDay, parse, setHours, setMinutes, startOfDay, endOfDay } from 'date-fns';
import { listEvents } from './google';
import { db } from './db';

const WORK_START_HOUR = 9;
const WORK_END_HOUR = 20; // 8 PM
const SLOT_DURATION_MINUTES = 30;
const TIMEZONE = 'Europe/Madrid'; // Spanish barbershop implied by name? Or local.

export async function getAvailableSlots(dateStr: string) {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());

    // Basic working hours check (e.g. closed on Sundays)
    if (getDay(date) === 0) return []; // Closed on Sunday

    const dayStart = setMinutes(setHours(date, WORK_START_HOUR), 0);
    const dayEnd = setMinutes(setHours(date, WORK_END_HOUR), 0);

    // 1. Get Google Calendar Events
    const timeMin = dayStart.toISOString();
    const timeMax = dayEnd.toISOString();

    const googleEvents = await listEvents(timeMin, timeMax); // Returns standard GCal Event objects

    // 2. Get Turso Appointments (pending or confirmed)
    // We need to query range overlap.
    const tursoResult = await db.execute({
        sql: `
        SELECT start_time, end_time FROM appointments 
        WHERE status IN ('pending', 'confirmed')
        AND date(start_time) = ?
    `, // SQLite date function might vary, better to use range check on ISO strings
        args: [dateStr]
    });

    // Actually, better to query by range string comparison since ISO8601 sorts correctly
    // But simplistic date(...) is okay if stored as ISO.
    // Let's rely on standard ISO string comparison for robust range query
    /*
    const startISO = dayStart.toISOString();
    const endISO = dayEnd.toISOString();
    sql: "SELECT start_time, end_time FROM appointments WHERE status IN ('pending', 'confirmed') AND start_time >= ? AND start_time < ?"
    */

    const tursoAppts = tursoResult.rows.map(row => ({
        start: new Date(row.start_time as string),
        end: new Date(row.end_time as string)
    }));

    // 3. Generate all possible slots
    const slots = [];
    let currentSlot = dayStart;

    while (currentSlot < dayEnd) {
        const slotEnd = addMinutes(currentSlot, SLOT_DURATION_MINUTES);

        // Check collision with Google Events
        const isBusyGoogle = googleEvents.some((event: any) => {
            const eventStart = new Date(event.start.dateTime || event.start.date); // Handle all-day
            const eventEnd = new Date(event.end.dateTime || event.end.date);

            return areIntervalsOverlapping(
                { start: currentSlot, end: slotEnd },
                { start: eventStart, end: eventEnd }
            );
        });

        // Check collision with Turso
        const isBusyTurso = tursoAppts.some(appt => {
            return areIntervalsOverlapping(
                { start: currentSlot, end: slotEnd },
                { start: appt.start, end: appt.end }
            );
        });

        if (!isBusyGoogle && !isBusyTurso) {
            slots.push(format(currentSlot, 'HH:mm'));
        }

        currentSlot = slotEnd;
    }

    return slots;
}
