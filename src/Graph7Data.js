const oneof = arr => arr[ Math.floor( Math.random() * arr.length ) ];

const dateBetween = ( min, max ) => new Date( min.valueOf() + ( max.valueOf() - min.valueOf() ) * Math.random() );

const numberBetween = ( min, max ) => Math.round( min + ( max - min ) * Math.random() );

const weekString = date => {
 
    date = new Date( date.toISOString().slice( 0, 10 ) )
    date.setDate( date.getDate() - date.getDay() - 2 );
    return date.toISOString().slice( 0, 10 );

};

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

// persons
export const persons = [ 
    
    { id: "and", name: "Andrew", color: colors[ 0 ] },
    { id: "gar", name: "Gareth", color: colors[ 1 ] },
    { id: "bob", name: "Bob", color: colors[ 2 ] },
    { id: "nia", name: "Niamh", color: colors[ 3 ] },
    { id: "ste", name: "Stephen", color: colors[ 4 ] },
    { id: "chr", name: "Chris", color: colors[ 5 ] },
    { id: "sar", name: "Sarah-Jane", color: colors[ 6 ] }

];
const personIds = persons.map( x => x.id );

// events
export const events = [];
const minDate = new Date( "2017-06-01" );
const maxDate = new Date( "2018-03-01" );
const generateEvent = () => ( {

    id: oneof( personIds ),
    when: weekString( dateBetween( minDate, maxDate ) ),
    score: numberBetween( -10, 10 )

} );
for( let i = 0; i < persons.length * 10; i++ ) {

    events.push( generateEvent() );

}

