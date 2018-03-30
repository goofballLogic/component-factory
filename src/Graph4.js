import React, { Component } from "react";
import "./Graph4.css";
import { sampleData, seriesAnalysis, accumulate, ticks as calcTicks } from "./series";
import { measure } from "./plot";
import deepmerge from "deepmerge";

const data = accumulate( sampleData, "when", "score" );
const [ xanalysis, yanalysis ] = seriesAnalysis( data );

const ticks = calcTicks( yanalysis.omin, yanalysis.omax, 4 );

const enrichAxisTickBoundingDimensions = state => deepmerge( state, { axis: { 
    
    y: { ticks: { 
    
        textWidth: state.axis.y.ticks.width,
        width: Math.ceil( state.axis.y.ticks.width * 2 )

    } },
    x: { ticks: {

        textHeight: state.axis.x.ticks.height,
        height: Math.ceil( state.axis.x.ticks.height * 2 )

    } }

} } );
const enrichAxisTicksAvailableBoundingDimension = state => deepmerge( state, { axis: {

    y: { ticks: {

        topPadding: state.axis.y.ticks.height / 2,
        totalHeight: state.viewBox.height
            - state.axis.x.ticks.height // bottom padding
            - state.axis.y.ticks.height / 2 // top padding
        
    } },
    x: { ticks: {

        leftPadding: Math.max( state.axis.y.ticks.width, state.axis.x.ticks.width / 2 ),
        totalWidth: state.viewBox.width
            - Math.max( state.axis.y.ticks.width, state.axis.x.ticks.width / 2 ) // left-hand padding
            - state.axis.x.ticks.width / 2 // right-hand padding

    } }

} } );
const enrichAxisCoordinates = state => deepmerge( state, { axis: {

    y: {
        
        top: state.axis.y.ticks.topPadding,
        bottom: state.axis.y.ticks.totalHeight + state.axis.y.ticks.topPadding,
        left: 0,
        right: state.axis.y.ticks.width,
        width: state.axis.x.ticks.leftPadding,
        height: state.axis.y.ticks.totalHeight
    
    },
    x: {
 
        top: state.axis.y.ticks.totalHeight + state.axis.y.ticks.topPadding,
        bottom: state.viewBox.height,
        left: state.axis.x.ticks.leftPadding,
        right: state.axis.x.ticks.leftPadding + state.axis.x.ticks.totalWidth,
        width: state.axis.x.ticks.totalWidth,
        height: state.viewBox.height - state.axis.y.ticks.totalHeight - state.axis.y.ticks.topPadding

    }

} } );
const enrich = state =>
    enrichAxisCoordinates(
    enrichAxisTicksAvailableBoundingDimension(
    enrichAxisTickBoundingDimensions( 
        state
    )));

const Rect = ( { id, left, x, top, y, width, height } ) => 

    <rect x={x || left} y={y || top} width={width} height={height} id={id} />

export default class G4 extends Component {
    
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

        ...this.state,
        drawReady: true,
        viewRect: JSON.parse( JSON.stringify( this.container.getBoundingClientRect() ) ),
        axis: {
            
            y: {
            
                ticks: [ yanalysis.max, yanalysis.min ]
                    .map( value => measure( value, this.container ) )
                    .reduce( ( a, b ) => a.width > b.width ? a : b )
            
                },
            x: {

                ticks: [ xanalysis.max, xanalysis.min ]
                    .map( value => measure( value, this.container ) )
                    .reduce( ( a, b ) => a.height > b.height ? a : b )

            }

        }

    } ) );

    componentDidMount = this.calculateBounds

    render = () => [

        <pre key="debug">{JSON.stringify( this.state, null, 3 )}</pre>,            
        <div key="working" className="g4">

            <svg viewBox={`0 0 ${this.state.viewBox.width} ${this.state.viewBox.height}`} ref={ x => this.container = x }>
            
                { this.state.drawReady ?

                    <g id="axes">

                        <Rect id="x-axis" {...this.state.axis.x} /> 
                        <Rect id="y-axis" {...this.state.axis.y} />

                    </g>

                : null }
                    
            </svg>

        </div>

    ];

}
