import React, { Component } from "react";
import { ReferenceLine, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from "moment";
import "./Graph7.css";

const colors = [
    
    "0,0,0",
    "0,255,0",
    "0,0,255",
    "255,0,0",
    "1,255,254",
    "255,166,254",
    "255,219,102",
    "255,219,102",
    "0,100,1",
    "1,0,103",
    "149,0,58",
    "0,125,101",
    "255,0,246",
    "119,77,0",
    "144,251,146"

];
const persons = [ 
    
    { id: "and", name: "Andrew", color: colors[ 0 ] },
    { id: "gar", name: "Gareth", color: colors[ 1 ] },
    { id: "bob", name: "Bob", color: colors[ 2 ] },
    { id: "nia", name: "Niamh", color: colors[ 3 ] },
    { id: "ste", name: "Stephen", color: colors[ 4 ] },
    { id: "chr", name: "Chris", color: colors[ 5 ] },
    { id: "sar", name: "Sarah-Jane", color: colors[ 6 ] }

];
const personIds = persons.map( x => x.id );
function failWithNull( strategy ) { try { return strategy(); } catch( e ) { return null; } }
const withPayload = ( xs, callback ) => failWithNull( () => callback( xs[ 0 ].payload ) );
const FormattedToolTip = ( { payload } ) => withPayload( payload, pp =>
    
    <div className="tooltip">

        <p className="when">{ moment( pp.dateWhen ).format( "dddd, MMMM Do" ) }</p>    
        { persons
            .map( p => ( { ...p, total: pp.runningTotals[ p.id ] || 0 } ) )
            .sort( ( a, b ) => a.total > b.total ? -1 : a.total < b.total ? 1 : 0 )
            .map( p => 
        
                <p className="scores" key={ p.id }>

                    <span className="score-name">{ p.name }</span>
                    <span className="score-score">{ p.total }</span>

                </p>

            ) 
        }

    </div>

);
const formatTick = x => moment( new Date( x ) ).format( "MMM Do YYYY" );
const events = [];
const oneof = arr => arr[ Math.floor( Math.random() * arr.length ) ];
const dateBetween = ( min, max ) => new Date( min.valueOf() + ( max.valueOf() - min.valueOf() ) * Math.random() );
const numberBetween = ( min, max ) => Math.round( min + ( max - min ) * Math.random() );
const weekString = date => {
 
    date = new Date( date.toISOString().slice( 0, 10 ) )
    date.setDate( date.getDate() - date.getDay() - 2 );
    return date.toISOString().slice( 0, 10 );

};
const minDate = new Date( "2017-06-01" );
const maxDate = new Date( "2018-03-01" );
const generateEvent = () => ( {

    id: oneof( personIds ),
    when: weekString( dateBetween( minDate, new Date( "2018-03-01" ) ) ),
    score: numberBetween( -10, 10 )

} );
for( let person of persons ) {

    events.push( { 
        
        id: person.id, 
        when: weekString( minDate ), 
        score: 0
    
    } );

}
for( let i = 0; i < persons.length * 10; i++ ) {

    events.push( generateEvent() );

}
for( let person of persons ) {

    events.push( {

        id: person.id,
        when: weekString( maxDate ),
        score: 0

    } );

}
const ord = x => ( typeof x.valueOf === "function" ) ? x.valueOf() : x;
const accumulationKey = "when";
const valueKey = "score";
const idKey = "id";
const index = events
    .map( x => [ ord( x[ accumulationKey ] ), x ] )
    .reduce( ( index, [ value, x ] ) => ( { 

        ...index, 
        [ value ]: [].concat( index[ value ] || [], x )

    } ), {} );
const runningTotals = {};
const updateRunningTotals = es => {

    for( let e of es ) {

        const id = e[ idKey ];
        runningTotals[ id ] = ( runningTotals[ id ] || 0 ) + e[ valueKey ];

    }
    //return runningTotals;
    return es.reduce( ( ret, e ) => ( { ...ret, [ e[ idKey ] ]: runningTotals[ e[ idKey ] ] } ), {} );

};
const data = Object.keys( index ).sort().map( key => ( {

    key,
    dateWhen: new Date( key ),
    dayWhen: new Date( key ).getDay(),
    when: new Date( key ).valueOf(),
    events: index[ key ],
    ...updateRunningTotals( index[ key ] ),
    runningTotals: { ...runningTotals }

} ) );
for( let id in Object.keys( runningTotals ) ) {

    data[ 0 ][ id ] = data[ 0 ][ id ] || 0;

}

export default class G7 extends Component {

    render() {

        return <ResponsiveContainer height={400} className="g7">

            <LineChart data={data} margin={{ right: 100 }}>

                <CartesianGrid strokeDasharray="3 3" />
                { Object.keys( runningTotals ).map( seriesId  => persons.find( p => p.id === seriesId ) ).map( person =>

                    <Line connectNulls={true} 
                        dataKey={person.id} 
                        key={person.id}
                        stroke={`rgb(${person.color})`}
                        type="linear"
                        name={person.name} />

                ) }
                <Legend c-ontent={console.log.bind( console )} />
                <Tooltip content={<FormattedToolTip />} />
                <XAxis dataKey="when" tickFormatter={formatTick} type="number" domain={ [ "dataMin", "dataMax" ] } tickCount={999} />
                <YAxis type="number" domain={ [ "dataMin - 2", "dataMax + 2" ] } tickCount={10} />
                <ReferenceLine y={0} stroke="black" />

            </LineChart>

        </ResponsiveContainer>;

    }

}
