import React from "react";
import "./Graph2.css";
import { sampleData, accumulate, seriesAnalysis, ticks } from "./series";

const accumulatedData = accumulate( sampleData, "when", "score" );
const analysis = seriesAnalysis( accumulatedData );
const G2 = () => (

	<div className="g2">
		<pre>Data: { JSON.stringify( sampleData, null, 3 ) }</pre>
		<pre>Accum: { JSON.stringify( accumulatedData, null, 3 ) }</pre>
		<pre>Analysis: { JSON.stringify( analysis, null, 3 ) }</pre>
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
	</div>

);

export default G2;
