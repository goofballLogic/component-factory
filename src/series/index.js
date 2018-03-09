export const sampleData = [
  { when: "2018-01-01", score: 1 },
  { when: "2018-01-03", score: 4 },
  { when: "2018-01-07", score: -1 },
  { when: "2018-01-19", score: 2 },
  { when: "2018-01-21", score: -3 },
  { when: "2018-01-29", score: -2 },
  { when: "2018-02-01", score: 4 },
  { when: "2018-02-03", score: -3 },
  { when: "2018-02-07", score: -1 },
  { when: "2018-02-19", score: -2 },
  { when: "2018-03-01", score: -1 },
  { when: "2018-03-03", score: 3 },
  { when: "2018-03-03", score: 3 },
  { when: "2018-03-07", score: -1 },
  { when: "2018-03-21", score: -1 },
  { when: "2018-03-24", score: 5 },
  { when: "2018-03-29", score: -2 },
  { when: "2018-04-01", score: -2 },
];

export function accumulate( data, keyName, valueName ) {

	const accumulateIntoIndex = ( index, key, value ) => ( { ...index, [ key ]: ( index[ key ] || 0 ) + value } );
	const digest = data.reduce( ( index, item ) => accumulateIntoIndex( index, item[ keyName ], item[ valueName ] ), {} );
	const sortedKeys = Object.keys( digest ).sort();
	const lastValueOf = series => series.length ? series[ series.length - 1 ][ 1 ] : undefined
	const nextRunningTotalEntry = ( series, key, value ) => [ key, digest[ key ] + ( lastValueOf( series ) || 0 ) ];
	return sortedKeys.reduce( ( series, key ) => [ ...series, nextRunningTotalEntry( series, key ) ], [] );

};

const ifUndef = ( x, d ) => typeof x === "undefined" ? d : x;
const min = ( x, y ) => ifUndef( x, ( y || 0 ) + 1 ) <= y ? x : y;
const max = ( x, y ) => ifUndef( x, ( y || 0 ) - 1 ) >= y ? x : y;
export const ord = x => typeof x === "string" ? ( new Date( x ) ).valueOf() : x;

export function seriesAnalysis( series ) {

	return series.reduce( ( ret, item ) =>

		item.map( ( x, i ) => [

			min( ( ret[ i ] || [] )[ 0 ], x ),
			max( ( ret[ i ] || [] )[ 1 ], x )

		] ).map( ( [ min, max ] ) => ( [

			min, max,
			ord( min ), ord( max )

		] ) ).map( ( [ min, max, omin, omax ] ) => ( [

			min, max, omin, omax,
			omax - omin

		] ) ),
		[]

	);

}

// these functions aren't completely accurate because they count the leading 0 in number less than 0
const withSignificantPlaces = ( x, p ) => parseFloat( parseFloat( x ).toPrecision( p ) );
const significantPlaces = x => ( x.toString().replace( ".", "" ).length );

// attempt to find a set of ticks encompassing this min and max using the given order of magnitude (10-based)
function findTicks( min, max, ticksRequired, order ) {

	const powerOfTen = Math.pow( 10, order - 1 );

	// values being sought
	let intervalsFromBottomToZero; // intervals between 0 and the min value (only significant if min is negative because if min is 0, this will also be 0)
	let tickInterval; // value between ticks

	/*
		we iterate through multiples of powers of 10
		until we find one where, for the resulting tickInterval
		the number of ticks required to encompass min and max is <= specified ticksRequired
	*/
	let multipleOfPowerOfTen = 0;
	let candidateTicks; // number of ticks needed to get from min to max
	do {

		// up the multiplier
		multipleOfPowerOfTen++;
		// calculate new candidate tick interval
		tickInterval = multipleOfPowerOfTen * powerOfTen;
		// find the number of intervals to get from the bottom tick to 0
		intervalsFromBottomToZero = Math.ceil( Math.abs( min ) / tickInterval );
		// find the number of intervals to get from 0 to the top tick
		const intervalsFromZeroToTop = Math.ceil( Math.abs( max ) / tickInterval );
		// total number of ticks required is the sum of the two (plus 1 tick for 0 itself)
		candidateTicks = intervalsFromZeroToTop + intervalsFromBottomToZero + 1;

	} while( candidateTicks > ticksRequired ); // keep looping until the number of ticks is less than or equal to the number required

	// at this stage we have our (candidate) intervalsFromBottomToZero and tickInterval

	// the bottom tick
	let tick = -intervalsFromBottomToZero * tickInterval;
	if ( min < tick ) return null; // if the bottom one doesn't encompass the minimum value then bail out (no solution)

	// number of significant places in the tickInterval (used below to correct floating point errors)
	const tickIntervalPlaces = significantPlaces( tickInterval );

	// our array of ticks
	const ret = [];
	for( let i = 0; i < ticksRequired; i++ ) {

		ret.push( tick );
		// number of significant places in the previous tick
		const tickPlaces = significantPlaces( tick );
		// add the interval to get the new tick
		tick += tickInterval;
		// fix up the floating point math by ensuring the precision of the result is no more than the sum of the precision of the two arguments
		tick = withSignificantPlaces( tick, tickPlaces + tickIntervalPlaces );

	}

	if ( max > ret[ ret.length - 1 ] ) return null; // if the final tick is less than our max, no solution was found, so bail

	// result
	return ret;

}

// create a set of ticks which will bound the given min and max, include 0, and have minimum excess at min and max
export function ticks( min, max, ticksRequired ) {

	if ( ticksRequired < 2 ) { throw new Error( "Need at least 2 ticks" ); }
	// ensure both min and/or max include 0
	min = Math.min( 0, min );
	max = Math.max( 0, max );
	// determine the biggest order of magnitude which will be required to encomapss the min and max in ticks
	const biggest = Math.max( Math.abs( min ), Math.abs( max ) );
	let order = Math.ceil( Math.log10( biggest ) );

	// find a set of ticks for this order of magnitude
	let set = findTicks( min, max, ticksRequired, order );

	// while empty intervals exist at the top or bottom of the scale, reduce the order of magnitude and try again
	while( min > set[ 1 ] || max < set[ set.length -2 ] ) {

		order--;
		const attempt = findTicks( min, max, ticksRequired, order );
		if ( !attempt ) { break; } // no solution exists for this order of magnitude
		set = attempt;

	}
	return set;

}
