const workingDays = require('./index')

// Dates are built in local time (month is zero-indexed) so the tests pass in any time zone

// test getEasterSunday
test('in 2019, easter sunday should be on 21. apr', () => {
    expect(workingDays.getEasterSunday(2019)).toStrictEqual(new Date(2019, 3, 21));
});

test('in 2020, easter sunday should be on 12. apr', () => {
    expect(workingDays.getEasterSunday(2020)).toStrictEqual(new Date(2020, 3, 12));
});

test('in 2021, easter sunday should be on 4.april', () => {
    expect(workingDays.getEasterSunday(2021)).toStrictEqual(new Date(2021, 3, 4));
});

test('in 2022, easter sunday should be on 17.april', () => {
    expect(workingDays.getEasterSunday(2022)).toStrictEqual(new Date(2022, 3, 17));
});

test('in 2023, easter sunday should be on 9.april', () => {
    expect(workingDays.getEasterSunday(2023)).toStrictEqual(new Date(2023, 3, 9));
});

test('in 2026, easter sunday should be on 5.april', () => {
    expect(workingDays.getEasterSunday(2026)).toStrictEqual(new Date(2026, 3, 5));
});

// test isWorkingDay

test('17.5 is not a working date', () => {
    expect(workingDays.isWorkingDay(new Date(2021, 4, 17))).toBe(false);
});

test('1.7 is a working date', () => {
    expect(workingDays.isWorkingDay(new Date(2021, 6, 1))).toBe(true);
});

test('14.2 is not a working date', () => {
    expect(workingDays.isWorkingDay(new Date(2021, 1, 14))).toBe(false);
});

test('8.8.99 is not a working date', () => {
    expect(workingDays.isWorkingDay(new Date(1999, 7, 8))).toBe(false);
});

test('8.9.99 is a working date', () => {
    expect(workingDays.isWorkingDay(new Date(1999, 8, 8))).toBe(true);
});

test('2.5.96 is a working date', () => {
    expect(workingDays.isWorkingDay(new Date(1996, 4, 2))).toBe(true);
});

test('22.6.96 is not a working date', () => {
    expect(workingDays.isWorkingDay(new Date(1996, 5, 22))).toBe(false);
});

test('25.12.15 is not a working date', () => {
    expect(workingDays.isWorkingDay(new Date(2015, 11, 25))).toBe(false);
});

// Testing ascension day with a time set
test('18.05.23 is not a working date', () => {
    expect(workingDays.isWorkingDay(new Date(2023, 4, 18, 10))).toBe(false);
});

test.each([
    ['Maundy Thursday', new Date(2026, 3, 2)],
    ['Good Friday', new Date(2026, 3, 3)],
    ['Easter Monday', new Date(2026, 3, 6)],
    ['Ascension Day', new Date(2026, 4, 14)],
    ['Whit Monday', new Date(2026, 4, 25)],
])('%s 2026 is not a working date', (_, date) => {
    expect(workingDays.isWorkingDay(date)).toBe(false);
});

test('the days around easter 2026 are working dates', () => {
    expect(workingDays.isWorkingDay(new Date(2026, 3, 1))).toBe(true);
    expect(workingDays.isWorkingDay(new Date(2026, 3, 7))).toBe(true);
});

// test the timeZone option

test('reads the calendar day in the given time zone', () => {
    // 23:30 UTC on 1 April is 01:30 on Maundy Thursday in Oslo
    const instant = new Date('2026-04-01T23:30:00Z');
    expect(workingDays.isWorkingDay(instant, { timeZone: 'Europe/Oslo' })).toBe(false);
    expect(workingDays.isWorkingDay(instant, { timeZone: 'UTC' })).toBe(true);
});

test('handles daylight saving time in the given time zone', () => {
    // 22:30 UTC on 16 May is 00:30 on Constitution Day in Oslo (UTC+2 in summer)
    const instant = new Date('2027-05-16T22:30:00Z');
    expect(workingDays.isWorkingDay(instant, { timeZone: 'Europe/Oslo' })).toBe(false);
});

// test addWorkingDays

test('one working day after a Friday is the next Monday', () => {
    expect(workingDays.addWorkingDays(new Date(2026, 9, 16), 1)).toStrictEqual(new Date(2026, 9, 19));
});

test('adding zero working days returns the same calendar day', () => {
    expect(workingDays.addWorkingDays(new Date(2026, 9, 16, 15, 30), 0)).toStrictEqual(new Date(2026, 9, 16));
});

test('skips the easter holidays', () => {
    // Wednesday 1 April 2026 -> Tuesday 7 April, after Maundy Thursday to Easter Monday
    expect(workingDays.addWorkingDays(new Date(2026, 3, 1), 1)).toStrictEqual(new Date(2026, 3, 7));
});

test('skips christmas', () => {
    expect(workingDays.addWorkingDays(new Date(2026, 11, 23), 2)).toStrictEqual(new Date(2026, 11, 28));
});

test('counts from the calendar day in the given time zone', () => {
    // 23:30 UTC on Thursday 15 October is Friday 16 October in Oslo
    const instant = new Date('2026-10-15T23:30:00Z');
    expect(workingDays.addWorkingDays(instant, 1, { timeZone: 'Europe/Oslo' })).toStrictEqual(new Date(2026, 9, 19));
});

test('rejects negative or fractional working days', () => {
    expect(() => workingDays.addWorkingDays(new Date(), -1)).toThrow(RangeError);
    expect(() => workingDays.addWorkingDays(new Date(), 1.5)).toThrow(RangeError);
});
