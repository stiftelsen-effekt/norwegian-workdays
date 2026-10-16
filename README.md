# Norwegian workdays
Determines norwegian workdays (weekdays that are not public holidays)

[![npm](https://img.shields.io/npm/v/norwegian-workdays)](https://www.npmjs.com/package/norwegian-workdays)

## Usage
```js
const workingDays = require('norwegian-workdays')

workingDays.isWorkingDay(new Date(2021, 4, 17))      // false, Constitution Day
workingDays.addWorkingDays(new Date(2026, 9, 16), 1) // Monday 19 October 2026
workingDays.getEasterSunday(2026)                    // 5 April 2026
```

### Time zones
By default the calendar day is read in the local time zone. Pass `timeZone` to read it in
another zone, for example in a browser where the visitor may not be in Norway:

```js
// 23:30 UTC on 1 April 2026 is Maundy Thursday in Oslo
workingDays.isWorkingDay(new Date('2026-04-01T23:30:00Z'), { timeZone: 'Europe/Oslo' }) // false
workingDays.addWorkingDays(new Date(), 5, { timeZone: 'Europe/Oslo' })
```

`addWorkingDays` does not count the given date itself and returns the resulting calendar day at
local midnight.
