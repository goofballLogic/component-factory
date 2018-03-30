import React, { Component } from "react";
import "./Graph6.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { seriesAnalysis, accumulate, generateData } from "./series";
import moment from "moment";

const minDate = new Date("2017-06-01" );
const maxDate = new Date( "2018-03-01" );
const nameof = i => i === 0 ? "Bob" : i === 1 ? "Gareth" : "Andrew";

const data = generateData( 3, minDate, maxDate );
const accData = data.map( sampleData => accumulate( sampleData, "when", "score" ) );
const graphData = accData.map( ( series, i ) => series.map( 
    
    ( [ x, y ] ) => ( { 
                
        x: new Date( x ).valueOf(),
        y,
        name: nameof( i )

    } ) 

) );

function formatTick( value ) {

    var d = moment( new Date( value ) );
    return d.format( "MMM Do YYYY");

}
function formatPointPayload( payload, callback ) {

    try {

        return callback( payload[ 0 ].payload );

    } catch( ex ) {

        return null;

    }

}

const FormattedToolTip = ( { payload } ) => formatPointPayload( payload, pp =>

    <div className="tooltip">

        <p className="series-value">{pp.y}</p>
        <p className="series-name">{pp.name}</p>
        <p className="when">{moment( new Date( pp.x ) ).format( "dddd, MMMM Do" ) }</p>

    </div>

);

export default class G6 extends Component {

    constructor() {

        super();
        this.state = { x: 0 };

    }
    
    render() {

        return (

            <ResponsiveContainer height={300} className="g6">

                { graphData.map( ( series, i ) =>

                    <LineChart key={i} className="g6" data={series} margin={{ right: 100 }}>

                        <CartesianGrid strokeDasharray="3 3" />
                        <Line isAnimationActive={false} dataKey="y" />
                        <Tooltip content={<FormattedToolTip />} />
                        <XAxis dataKey="x" tickFormatter={formatTick} type="number" domain={['dataMin', 'dataMax + 604800000']} tickCount={100} />
                        <YAxis dataKey="y" />

                    </LineChart>

                ) }

            </ResponsiveContainer>
                
        );

    }

}