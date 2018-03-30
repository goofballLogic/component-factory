import React, { Component } from "react";
import "./Graph3.css";
import dateFormat from "dateformat";

import { sampleData, seriesAnalysis, accumulate, ticks } from "./series";
import { map, mapSingle, fitText } from "./plot";

// dimensions of the plot area
const area = {

	width: 3000,
	height: 1500,
	padding: { top: 50, right: 50, bottom: 100, left: 300 },
	ticks: { y: 5, x: 10 },
	tickLabellers: { x: n => dateFormat( n, "d mmm" ) }

};

// running total time-series of the data
const series = accumulate( sampleData, "when", "score" );

function graphPlot( container ) {

	const { padding, width, height, ticks: configTicks, tickLabellers } = area;
	const [ xbounds, ybounds ] = seriesAnalysis( series );
	const graph = {

		x: padding.left,
		y: height - padding.bottom,
		width: width - padding.left - padding.right,
		height: height - padding.bottom - padding.top

	};
	graph.points = map( series, [ graph.width, graph.height ], [ xbounds, ybounds ] ).map( ( item, i ) => ( {

		x: graph.x + item[ 0 ],
		y: graph.y - item[ 1 ],
		data: series[ i ]

	} ) );

	graph.polyline = graph.points.map( ( { x, y } ) => `${x},${y}` ).join( " " );

	const yticks = ticks( ybounds.omin, ybounds.omax, configTicks.y );
	const xticks = ticks( xbounds.omin, xbounds.omax, configTicks.x );
	const ytickPoints = mapSingle( yticks, graph.height );
	const xtickPoints = mapSingle( xticks, graph.width );
	const defaultLabeller = n => { try { return n.toString(); } catch( e ) { return ""; } };
	const yLabeller = ( tickLabellers && tickLabellers.y ) || defaultLabeller;
	const xLabeller = ( tickLabellers && tickLabellers.x ) || defaultLabeller;
	graph.ticks = {

		x: xtickPoints.map( ( x, i ) => ( {

			x: x + padding.left,
			y: height - padding.bottom,
			data: xticks[ i ] + xbounds.omin

		} ) ).map( o => ( {

			...o,
			tick: {

				x1: o.x,
				x2: o.x,
				y1: o.y - ( padding.bottom * 0.1 ),
				y2: o.y + ( padding.bottom * 0.1 )

			},
			label: {

				text: xLabeller( o.data ),
				x: o.x,
				y: o.y + ( padding.bottom * 0.1 ),
				width: graph.width / configTicks.x,
				height: padding.bottom * 0.8

			}

		} ) ),
		y: ytickPoints.map( ( y, i ) => ( {

			x: padding.left,
			y: padding.top + graph.height - y,
			data: yticks[ i ]

		} ) ).map( o => ( {

			...o,
			tick: {

				x1: padding.left * 0.9,
				x2: padding.left * 1.1,
				y1: o.y,
				y2: o.y

			},
			label: {

				text: yLabeller( o.data ),
				x: padding.left * 0.9,
				y: o.y,
				width: padding.left * 0.8,
				height: graph.height / configTicks.y

			}

		} ) )

	};
	if( tickLabellers && tickLabellers.y ) { graph.ticks.yLabelSample = tickLabellers.y( graph.ticks.yLabelSample ); }
	if( tickLabellers && tickLabellers.x ) { graph.ticks.xLabelSample = tickLabellers.x( graph.ticks.xLabelSample ); }
	return graph;

}

const result = graphPlot();


export default class G3 extends Component {

	resizeText() {


	}

	componentDidMount() {

		this.resizeText();

	}

	componentDidUpdate() {

		this.resizeText();

	}



	render() {

		return (

			<div className="g3">

				<svg viewBox={`0 0 ${area.width} ${area.height}`} ref={ x => this.svg = x }>

					<line className="x-axis" x1={ result.x } x2={ result.x + result.width } y1={ result.y } y2={ result.y } />
					<line className="y-axis" x1={ result.x } x2={ result.x } y1={ result.y - result.height } y2={ result.y } />
					<polyline points={ result.polyline } className="series" />
					<g className="axis-labels">
						<g className="x-axis-labels">
						{ result.ticks.x.map( t =>

							<g key={t.x}>

								<text data-tick={t} x={t.label.x} y={t.label.y}>{t.label.text}</text>
								<line x1={t.tick.x1} x2={t.tick.x2} y1={t.tick.y1} y2={t.tick.y2} />

							</g>

						) }
						</g>
						<g className="y-axis-labels">
						{ result.ticks.y.map( t =>

							<g key={t.y}>

								<text data-tick={JSON.stringify(t)} x={t.label.x} y={t.label.y}>{t.label.text}</text>
								<line x1={t.tick.x1} x2={t.tick.x2} y1={t.tick.y1} y2={t.tick.y2} />

							</g>

						) }
						</g>

					</g>

				</svg>

			</div>

		);

	}

};
