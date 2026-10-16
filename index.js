/**
 * Gets the calendar day of a date as a Date at local midnight.
 * With a time zone, the calendar day is the one in that zone, e.g. "Europe/Oslo".
 * @param {Date} date
 * @param {string} [timeZone]
 * @returns {Date}
 */
function toCalendarDay(date, timeZone) {
    if (!timeZone) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }

    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }).formatToParts(date)
    const part = (type) => Number(parts.find((p) => p.type === type).value)

    return new Date(part('year'), part('month') - 1, part('day'))
}

module.exports = {
    /**
     * Checks wether a certain date is a working day
     * @param {Date} inputDate
     * @param {{ timeZone?: string }} [options] Time zone to read the calendar day in,
     * e.g. "Europe/Oslo". Defaults to the local time zone.
     * @returns {boolean}
     */
    isWorkingDay(inputDate, options = {}) {
        const day = toCalendarDay(inputDate, options.timeZone)

        // Month
        const month = day.getMonth()
        // Date
        const date = day.getDate()
        // Day of week (Sunday - Saturday : 0 - 6)
        const weekday = day.getDay()

        /**
         * Saturday and sundays
         */

        if (weekday === 6 || weekday === 0)
            return false

        /**
         * New Year's Day
         */
        if (month === 0 && date === 1)
            return false

        /**
         * Labour Day and Constitution Day
         */
        if (month === 4 && (date === 1 || date === 17)){
            return false
        }

        /**
         * Christmas Day and Boxing Day
         */
        if (month === 11 && (date === 25 || date === 26))
            return false

        /**
         * We need to know which date easter sunday falls on
         * to calculate the remaining holidays
         */
        const easter = this.getEasterSunday(day.getFullYear())

        /**
         * Input day is Easter Sunday
         */
        if (day.toDateString() === easter.toDateString())
            return false

        /**
         * Maundy Thursday
         * We mutate the easter sunday object, thus further calls
         * to setDate are relative to the latest mutation
         */
        easter.setDate(easter.getDate() - 3)
        if (day.toDateString() === easter.toDateString())
            return false

        /**
         * Good Friday
         */
        easter.setDate(easter.getDate() + 1)
        if (day.toDateString() === easter.toDateString())
            return false

        /**
         * Easter Monday
         */
        easter.setDate(easter.getDate() + 3)
        if (day.toDateString() === easter.toDateString())
            return false

        /**
         * Ascension Day
         */
        easter.setDate(easter.getDate() + 38)
        if (day.toDateString() === easter.toDateString())
            return false

        /**
         * Whit Monday
         */
        easter.setDate(easter.getDate() + 11)
        if (day.toDateString() === easter.toDateString())
            return false

        return true;
    },

    /**
     * Gets the working day that is a number of working days after a date.
     * The date itself is not counted, so one working day after a Friday is the next Monday.
     * @param {Date} inputDate
     * @param {number} workingDays
     * @param {{ timeZone?: string }} [options] Time zone to read the calendar day in,
     * e.g. "Europe/Oslo". Defaults to the local time zone.
     * @returns {Date} The resulting calendar day, at local midnight
     */
    addWorkingDays(inputDate, workingDays, options = {}) {
        if (!Number.isInteger(workingDays) || workingDays < 0) {
            throw new RangeError("workingDays must be a non-negative integer.")
        }

        const day = toCalendarDay(inputDate, options.timeZone)
        let remaining = workingDays
        while (remaining > 0) {
            day.setDate(day.getDate() + 1)
            if (this.isWorkingDay(day)) remaining--
        }

        return day
    },

    /**
     * Gets the date of Easter Sunday for a given year
     * @param {number} year
     * @returns {Date} Easter Sunday at local midnight
     */
    getEasterSunday(year) {
        try {
            year = Number( year );
            if ( year != year ) {
                throw new TypeError( "Value must be a number." );
            }
            else if ( year > 275760 || year < -271820 ) {
                throw new RangeError( "Value be between -271820 and 275760 due to technical limitations of Date constructor." );
            }
        }
        catch ( e ) { console.error( e ); }

        year = Math.floor( year );
        var c = Math.floor( year / 100 );
        var n = year - 19 * Math.floor( year / 19 );
        var k = Math.floor( ( c - 17 ) / 25 );
        var i = c - Math.floor( c / 4 ) - Math.floor( ( c - k ) / 3 ) + 19 * n + 15;
        i = i - 30 * Math.floor( i / 30 );
        i = i - Math.floor( i / 28 ) * ( 1 - Math.floor( i / 28 ) * Math.floor( 29 / ( i + 1 ) ) * Math.floor( ( 21 - n ) / 11 ) );
        var j = year + Math.floor( year / 4 ) + i + 2 - c + Math.floor( c / 4 );
        j = j - 7 * Math.floor( j / 7 );
        var l = i - j;
        var m = 3 + Math.floor( ( l + 40 ) / 44 );
        var d = l + 28 - 31 * Math.floor( m / 4 );

        // Build the date in local time. Parsing "YYYY-MM-DD" gives UTC midnight, which is
        // the previous day in time zones west of UTC.
        return new Date(year, m - 1, d)
    }
}
