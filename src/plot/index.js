import { seriesAnalysis, ord } from "../series";
export function map( series, dimensions ) {

	const analysis = seriesAnalysis( series );
	const ratios = dimensions
		.map( ( size, i ) => ( [ size, analysis[ i ][ 4 ] ] ) )
		.map( ( [ size, dataSize ] ) => dataSize ? size / dataSize : 0 );

	return series.map( item => item.map( ( value, i ) => ( ord( value ) - analysis[ i ][ 2 ] )  * ratios[ i ] ) );

};
