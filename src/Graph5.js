import React, { Component } from "react";
import "./Graph5.css";
import { sampleData, seriesAnalysis, accumulate, ticks as calcTicks } from "./series";
import { measure } from "./plot";
import deepmerge from "deepmerge";

const data = accumulate( sampleData, "when", "score" );
const [ xanalysis, yanalysis ] = seriesAnalysis( data );

function calculateYAxis( state, xsize, ysize ) {

    const xAxisLabelHeight = xsize.height + xsize.padding.top + xsize.padding.bottom;
    const yAxisLabelHeight = ysize.height + ysize.padding.top + ysize.padding.bottom;
    const yAxisLabelWidth = ysize.width + ysize.padding.left + ysize.padding.right;
    const xAxisLabelWidth = xsize.width + xsize.padding.left + xsize.padding.right;

    // reserve space which might potentially be needed for labels at the top and bottom of the axis
    const yAxisLabelsBottomOffset = Math.max( 
        
        0, // this means that the height of the x-axis labels is less than the padded height reserved for bottom-most y-axis label
        xAxisLabelHeight - ( yAxisLabelHeight / 2 ) // this means that the x-axis labels protrude beyond the bottom of the bottom-most y-axis label
    
    );
    const labelsTop = 0;
    const labelsBottom = state.viewBox.height - yAxisLabelsBottomOffset;
    const top = labelsTop + yAxisLabelHeight / 2;
    const bottom = labelsBottom - yAxisLabelHeight / 2;
    const width = Math.max(

        yAxisLabelWidth, // this means that the width of the y-axis labels is gte the padded width reserved for left-most x-axis labels
        xAxisLabelWidth / 2 // this means that the left-most x-axis label will protrude beyond the left of the y-axis label

    );
    return { 
        
        left: width,
        top, 
        bottom, 
        right: width,
        labels: {
            
            top: labelsTop,
            bottom: labelsBottom,
            left: 0,
            right: width

        }
    
    };

}

function enrich( state, container ) {

    const biggestSizing = ( samples, size ) => samples
        .map( v => measure( v, container ) )
        .reduce( ( a, b ) => size( a ) < size( b ) ? b : a );
    
    // find biggest sample text sizing per axis
    const ysize = biggestSizing( [ yanalysis.omin, yanalysis.omax ], s => s.width );
    const xsize = biggestSizing( [ xanalysis.omin, xanalysis.omax ], s => s.width );

    // padding for the tick text
    ysize.padding = { 
        
        top: ysize.height / 2, 
        right: ysize.width / 2, 
        bottom: ysize.height / 2, 
        left: 0
    
    };
    xsize.padding = { 
        
        top: xsize.height / 2, 
        right: xsize.width / 2, 
        bottom: 0,
        left: xsize.width / 2 
    
    };

    const yAxis = calculateYAxis( state, xsize, ysize );

    const xAxisLabelHeight = xsize.height + xsize.padding.top + xsize.padding.bottom;
    const yAxisLabelHeight = ysize.height + ysize.padding.top + ysize.padding.bottom;
    const yAxisLabelWidth = ysize.width + ysize.padding.left + ysize.padding.right;
    const xAxisLabelWidth = xsize.width + xsize.padding.left + xsize.padding.right;
    const xAxisLabelOffset = Math.max(

        0, // if the left-most edge of the left-most x-axis label is to the left of the y-axis label
        yAxisLabelWidth - ( xAxisLabelWidth / 2 ) // if the y-axis labels start to the left of the left-most edge of the left-most x-axis label
    
    );
    const xAxis = { 
        
        labels: {

            top: state.viewBox.height - xAxisLabelHeight,
            right: state.viewBox.width,
            bottom: state.viewBox.height,
            left: xAxisLabelOffset

        }
    
    }
    return deepmerge( state, { 
        
        drawReady: true, 
        axis: { 
            
            y: yAxis, 
            x: xAxis 
    
        } 
    
    } );

}

const Rect = ( { id, top, left, bottom, right } ) => 

    <rect x={left} y={top} width={right - left} height={bottom - top} id={id} />

const Line = ( { id, top, left, bottom, right } ) =>

    <line x1={left} x2={right} y1={top} y2={bottom} id={id} />

export default class G5 extends Component {
    
    constructor() {

        super();
        this.state = {

            viewBox: {
                
                width: 1000,
                height: 500

            }

        };

    }

    calculateBounds = () => this.setState( enrich( {

        ...this.state

    }, this.container ) );

    componentDidMount = this.calculateBounds

    render = () => [

        <pre key="debug">{JSON.stringify( this.state, null, 3 )}</pre>,            
        <div key="working" className="g5">

            <svg viewBox={`0 0 ${this.state.viewBox.width} ${this.state.viewBox.height}`} ref={ x => this.container = x }>
            
                { this.state.drawReady ?

                    <g id="axes">

                        <Rect id="x-axis-labels" {...this.state.axis.x.labels} /> 
                        <Rect id="y-axis-labels" {...this.state.axis.y.labels} />
                        <Line id="x-axis" {...this.state.axis.x} />
                        <Line id="y-axis" {...this.state.axis.y} />

                    </g>

                : null }
                    
            </svg>

        </div>

    ];

}
