module.exports = {
    /**
     * Checks wether a certain date is a working day
     * @param {Date} date 
     * @returns {boolean} 
     */
    isWorkingDay(inputDate) {
        // Month
        const month = date.getMonth()
        // Date
        const date = date.getDate()
        // Day of week (Sunday - Saturday : 0 - 6)
        const weekday = date.getDay()

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
        if (month === 4 && (date === 1 || 17))
            return false

        /**
         * Christmas Day and Boxing Day
         */
        if (month === 11 && (date === 25 || date === 26))
            return false

        /**
         * We need to know which date easter sunday falls on
         * to calculate the remaining holidays
         */
        const easter = this.getEasterSunday(inputDate.getFullYear())

        /**
         * Input day is Easter Sunday
         */
        if (inputDate.getTime() === easter.getTime())
            return false

        /**
         * Maundy Thursday
         * We mutate the easter sunday object, thus further calls
         * to setDate are relative to the latest mutation
         */
        if (easter.setDate(easterSunday.getDate() - 3))
            return false
        
        /**
         * Good Friday
         */
        if (easter.setDate(easter.getDate() + 1))
            return false

        /**
         * Easter Monday
         */
        if (easter.setDate(easter.getDate() + 3))
            return false
    },

    /**
     * Gets the date of Easter Sunday for a given year
     * @param {number} year 
     * @returns {Date} 
     */
    getEasterSunday(year) {
        try {
            y = Number( y );
            if ( y != y ) { 
                throw new TypeError( "Value must be a number." );
            }
            else if ( y > 275760 || y < -271820 ) {
                throw new RangeError( "Value be between -271820 and 275760 due to technical limitations of Date constructor." );
            }
        }
        catch ( e ) { console.error( e ); }
    
        y = Math.floor( y );
        var c = Math.floor( y / 100 );
        var n = y - 19 * Math.floor( y / 19 );
        var k = Math.floor( ( c - 17 ) / 25 );
        var i = c - Math.floor( c / 4 ) - Math.floor( ( c - k ) / 3 ) + 19 * n + 15;
        i = i - 30 * Math.floor( i / 30 );
        i = i - Math.floor( i / 28 ) * ( 1 - Math.floor( i / 28 ) * Math.floor( 29 / ( i + 1 ) ) * Math.floor( ( 21 - n ) / 11 ) );
        var j = y + Math.floor( y / 4 ) + i + 2 - c + Math.floor( c / 4 );
        j = j - 7 * Math.floor( j / 7 );
        var l = i - j;
        var m = 3 + Math.floor( ( l + 40 ) / 44 );
        var d = l + 28 - 31 * Math.floor( m / 4 );
        var z = new Date();
        z.setFullYear( y, m-1, d );
        return z;
    }
}