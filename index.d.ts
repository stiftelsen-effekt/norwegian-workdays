export interface WorkingDayOptions {
    /** IANA time zone to read the calendar day in, e.g. "Europe/Oslo". Defaults to the local time zone. */
    timeZone?: string;
}

/** Checks whether a date is a Norwegian working day (not a weekend or public holiday) */
export function isWorkingDay(inputDate: Date, options?: WorkingDayOptions): boolean;

/**
 * Gets the working day that is a number of working days after a date.
 * The date itself is not counted. Returns the calendar day at local midnight.
 */
export function addWorkingDays(inputDate: Date, workingDays: number, options?: WorkingDayOptions): Date;

/** Gets Easter Sunday for a year, at local midnight */
export function getEasterSunday(year: number): Date;
