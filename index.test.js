const workingDays = require('./index')

// test getEasterSunday
test('in 2019, easter sunday should be on 21. apr', () => {
    expect(workingDays.getEasterSunday(2019)).toStrictEqual(new Date('2019-04-21'));
});

test('in 2020, easter sunday should be on 12. apr', () => {
    expect(workingDays.getEasterSunday(2020)).toStrictEqual(new Date('2020-04-12'));
});

test('in 2021, easter sunday should be on 4.april', () => {
    expect(workingDays.getEasterSunday(2021)).toStrictEqual(new Date('2021-04-04'));
});

test('in 2022, easter sunday should be on 17.april', () => {
    expect(workingDays.getEasterSunday(2022)).toStrictEqual(new Date('2022-04-17'));
});

test('in 2023, easter sunday should be on 9.april', () => {
    expect(workingDays.getEasterSunday(2023)).toStrictEqual(new Date('2023-04-09'));
});

// test isWorkingDay

test('17.5 is not a working date', () => {
    expect(workingDays.isWorkingDay(new Date('2021-05-17'))).toBe(false);
});

test('1.7 is a working date', () => {
    expect(workingDays.isWorkingDay(new Date('2021-07-01'))).toBe(true);
});

test('14.2 is not a working date', () => {
    expect(workingDays.isWorkingDay(new Date('2021-02-14'))).toBe(false);
});

test('8.8.99 is not a working date', () => {
    expect(workingDays.isWorkingDay(new Date('1999-08-08'))).toBe(false);
});

test('8.9.99 is a working date', () => {
    expect(workingDays.isWorkingDay(new Date('1999-09-08'))).toBe(true);
});

test('2.5.96 is a working date', () => {
    expect(workingDays.isWorkingDay(new Date('1996-05-02'))).toBe(true);
});

test('22.6.96 is not a working date', () => {
    expect(workingDays.isWorkingDay(new Date('1996-06-22'))).toBe(false);
});

test('25.12.15 is not a working date', () => {
    expect(workingDays.isWorkingDay(new Date('2015-12-25'))).toBe(false);
});


