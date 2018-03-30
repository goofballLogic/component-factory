import React from "react";
import "./Graph2.css";
import { sampleData, accumulate, seriesAnalysis, ticks } from "./series";
import { map, mapSingle, fitText } from "./plot";

const accumulatedData = accumulate( sampleData, "when", "score" );
const analysis = seriesAnalysis( accumulatedData );

function handleKeyUp( { target }, text, constraints ) {

	const value = target.value;
	const { x, y } = constraints;
	const { fontSize, height, vpadding } = fitText( value, text.parentElement, constraints );
	text.textContent = value;
	text.setAttribute( "font-size", fontSize );
	text.setAttribute( "y", y + height + vpadding / 2 );
	text.setAttribute( "x", x );

}

const G2 = () => (

	<div className="g2">

		<pre>Data: { JSON.stringify( sampleData, null, 3 ) }</pre>
		<pre>Accum: { JSON.stringify( accumulatedData, null, 3 ) }</pre>
		<pre>Analysis: { JSON.stringify( analysis, null, 3 ) }</pre>
		{seriesTest()}
		<pre>Visual map: {JSON.stringify( map( accumulatedData, [ 800, -400 ] ), null, 3 )}</pre>
		<pre>Ticks visual map: {JSON.stringify( mapSingle( ticks( -20, 70, 6 ), -400 ), null, 3 )}</pre>
		<svg viewBox="0 0 100 100" ref={ x => this.container = x }>
			<g>

				<text ref={ x => this.text = x }>hello</text>
				<line x1="0" y1="0" x2="100" y2="100" stroke="black" />

			</g>
		</svg>
		<input type="text" onKeyUp={e => handleKeyUp( e, this.text, this.container.viewBox.baseVal )} />
	</div>

);

const seriesTest = () => (

	<table>
		<thead>
			<tr>
				<th>Min</th>
				<th>Max</th>
				<th>#Ticks</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>-2</td>
				<td>7</td>
				<td>4</td>
				<td>{JSON.stringify( ticks( -2, 7, 4 ) )}</td>
			</tr>
			<tr>
				<td>-20</td>
				<td>70</td>
				<td>4</td>
				<td>{JSON.stringify( ticks( -20, 70, 4 ) )}</td>
			</tr>
			<tr>
				<td>-20</td>
				<td>70</td>
				<td>10</td>
				<td>{JSON.stringify( ticks( -20, 70, 10 ) )}</td>
			</tr>
			<tr>
				<td>-3</td>
				<td>3</td>
				<td>10</td>
				<td>{JSON.stringify( ticks( -3, 3, 10 ) )}</td>
			</tr>
			<tr>
				<td>-3</td>
				<td>3</td>
				<td>4</td>
				<td>{JSON.stringify( ticks( -3, 3, 4 ) )}</td>
			</tr>
			<tr>
				<td>0</td>
				<td>4</td>
				<td>4</td>
				<td>{JSON.stringify( ticks( 0, 4, 4 ) )}</td>
			</tr>
			<tr>
				<td>-34</td>
				<td>2933</td>
				<td>4</td>
				<td>{JSON.stringify( ticks( -34, 2933, 4 ) )}</td>
			</tr>
			<tr>
				<td>-34</td>
				<td>2933</td>
				<td>10</td>
				<td>{JSON.stringify( ticks( -34, 2933, 10 ) )}</td>
			</tr>
			<tr>
				<td>5.47</td>
				<td>9.8</td>
				<td>9</td>
				<td>{JSON.stringify( ticks( 5.47, 9.8, 9 ) )}</td>
			</tr>
		</tbody>
	</table>

);

export default G2;
