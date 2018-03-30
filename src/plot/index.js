import { seriesAnalysis, seriesAnalysisSingle, ord } from "../series";
const SVGNS = "http://www.w3.org/2000/svg";

export function mapSingle( numbers, dimension, bounds ) {

	bounds = bounds || seriesAnalysisSingle( numbers );
	const dataSize = bounds.size;
	const ratio = dataSize ? ( dimension / dataSize ) : 0;
	return numbers.map( value => ( ord( value ) - bounds.omin ) * ratio );

}

export function map( series, dimensions, bounds ) {

	bounds = bounds || seriesAnalysis( series );
	const ratios = dimensions
		.map( ( size, i ) => ( [ size, bounds[ i ].size ] ) )
		.map( ( [ size, dataSize ] ) => dataSize ? size / dataSize : 0 );

	return series.map( item => item.map( ( value, i ) => ( ord( value ) - bounds[ i ].omin ) * ratios[ i ] ) );

};

export function measure( text, container ) {

	// create and add test element
	const svgText = document.createElementNS( SVGNS, "text" );
	svgText.textContent = text;
	svgText.style.visibility = "hidden";
	container.appendChild( svgText );

	// measure current font-size and svg width/height
	const fontSize = parseFloat( getComputedStyle( svgText, null ).getPropertyValue( "font-size" ) );
	const { width, height } = svgText.getBBox();

	// remove the test element
	container.removeChild( svgText );

	return { width, height, fontSize, sampleText: text };

}

export function fitText( text, container, dimensions ) {

	// create and add test element
	const svgText = document.createElementNS( SVGNS, "text" );
	svgText.textContent = text;
	svgText.style.visibility = "hidden";
	container.appendChild( svgText );

	// measure current font-size and svg width/height
	const initialFontSize = parseFloat( getComputedStyle( svgText, null ).getPropertyValue( "font-size" ) );
	const { width: testWidth, height: testHeight } = svgText.getBBox();

	// measure the container's width and height and thus the necessary ratios to fit
	const { width: containerWidth, height: containerHeight } = dimensions;
	const neededWidthRatio = containerWidth / testWidth;
	const neededHeightRatio = containerHeight / testHeight;
	// calculate the new font-size to allow for the text width
	const fontSize = Math.min( neededWidthRatio, neededHeightRatio ) * initialFontSize;

	// update the text with the new font size, then measure the actual height
	svgText.setAttribute( "font-size", fontSize );
	const { height } = svgText.getBBox();

	// calculate excess vertical space ("padding")
	const vpadding = containerHeight - height;

	// remove the test element
	container.removeChild( svgText );

	return { height, fontSize, vpadding };

}