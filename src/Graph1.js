import React, { Component } from 'react';
import './Graph1.css';

const min = ( series, order ) => series.reduce( ( curr, x ) => x[ order ] < curr[ order ] ? x : curr );
const max = ( series, order ) => series.reduce( ( curr, x ) => x[ order ] > curr[ order ] ? x : curr );
const perDay = 86400000;

const raw = [
  [ "2018-01-01", 1 ],
  [ "2018-01-03", 4 ],
  [ "2018-01-07", -1 ],
  [ "2018-01-19", 2 ],
  [ "2018-01-21", -4 ],
  [ "2018-01-29", -2 ],
  [ "2018-02-01", 4 ],
  [ "2018-02-03", -3 ],
  [ "2018-02-07", -1 ],
  [ "2018-02-19", -2 ],
  [ "2018-03-01", -1 ],
  [ "2018-03-03", 3 ],
  [ "2018-03-07", -1 ],
  [ "2018-03-21", -2 ],
  [ "2018-03-24", 3 ],
  [ "2018-03-29", -2 ],
  [ "2018-04-01", -2 ],
];

const series = [];
let sum = 0;
for( const x of raw ) {

  sum += x[ 1 ];
  series.push( [ x[ 0 ], sum ] );

}

class Graph1 extends Component {
  render() {

    // the view area
    const viewWidth = 1000;
    const viewHeight = 500;
    const paddingThickness = 50;
    // parameters
    const axisThickness = 50;
    // the x axis view
    const xAxisMin = paddingThickness + axisThickness;
    const xAxisMax = viewWidth - paddingThickness;
    const xAxisWidth = xAxisMax - xAxisMin;
    // the x axis data
    const xDataMin = new Date( min( series, 0 )[ 0 ] ).valueOf();
    const xDataMax = new Date( max( series, 0 )[ 0 ] ).valueOf();
    const xDataSize = xDataMax - xDataMin;
    // the ratio of x-axis data values to x-axis view
    const xAxisRatio = xAxisWidth / xDataSize;
    // the y axis view
    const yAxisBottom = viewHeight - paddingThickness - axisThickness;
    const yAxisTop =  paddingThickness;
    const yAxisHeight = yAxisBottom - yAxisTop;
    // the y axis data
    const yDataMin = min( series, 1 )[ 1 ];
    const yDataMax = max( series, 1 )[ 1 ];
    const yRangeMin = Math.min( 0, yDataMin );
    const yDataSize = yDataMax - yRangeMin;
    // the ratio of the y-axis data values to y-axis view (flipped to match normal graphs)
    const yAxisRatio = -1 * yAxisHeight / yDataSize;
console.log( yAxisRatio );
    // x-axis y location
    const xAxisY = yAxisBottom - ( yRangeMin * yAxisRatio );
    // text size (height)
    const textSize = Math.min( yAxisHeight / 20, xAxisWidth / 20 );
    const seriesPoints = series.map( x => [

      ( new Date( x[ 0 ] ).valueOf() - xDataMin ) * xAxisRatio,
      ( x[ 1 ] - yRangeMin ) * yAxisRatio

    ] );
    // y axis ticks
    const yAxisTickSize = yDataSize / 5;
    const yAxisTicks = [];
    let tick = 0;
    while (tick < yDataMax) {

      tick += yAxisTickSize;
      yAxisTicks.push( tick );

    }
    console.log( yAxisTicks );
    const points = "M " + seriesPoints.map( x => `${x[0]} ${x[1] + yDataMin}` ).join( " L " );
    //const points = "0,120 20,60 40,80 60,20";
    return (
      <div className="Graph1">

        <p>
          Data (y): {yDataMin} - {yDataMax}
        </p>
        <svg className="graph" viewBox={`0 0 ${viewWidth} ${viewHeight}`}>

          <g transform={`translate(${xAxisMin},${yAxisBottom})`}>

            <path className="graph-path" d={points} />

          </g>
          <g>

            <rect className="x-asix-background" x={xAxisMin} y={xAxisY} height={axisThickness} width={xAxisWidth} />
            <line className="x-axis" x1={xAxisMin} x2={xAxisMax} y1={xAxisY} y2={xAxisY} />

          </g>
          <g>

            <rect className="y-axis-background" x={xAxisMin - axisThickness} y={yAxisTop} height={yAxisHeight} width={axisThickness} />
            <text x={xAxisMin - textSize / 2} y={yAxisBottom} fontSize={`${textSize}px`} textAnchor="end">
              5
            </text>
            <foreignObject x={xAxisMin - axisThickness} y={yAxisTop} height={yAxisHeight} width={axisThickness}>
              <div style={{ wordBreak: "break-word", "overflow": "auto", maxWidth: axisThickness, padding: 10 }}>
                Hello there my friends
              </div>
            </foreignObject>
            <line className="y-axis" x1={xAxisMin} x2={xAxisMin} y1={yAxisBottom} y2={yAxisTop} />

          </g>

        </svg>

      </div>
    );
  }
}

export default Graph1;
