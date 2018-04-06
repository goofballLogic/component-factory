function upsertArray( obj, key, item ) {

    const arr = obj[ key ] || [];
    arr.push( item );
    return { ...obj, [ key ]: arr };

}

const withPoints = ( data, idKey, valueKey ) => ( {

    ...data,
    points: data.events.reduce( ( index, event ) => upsertArray( 
        
        index,
        event[ idKey ],
        event[ valueKey ]
        
    ), {} )

} );

const withRunningTotals = ( data, memo ) => {

    const { points } = data;
    for( let id of Object.keys( points ) ) {

        const pointsScore = points[ id ].reduce( ( x, y ) => x + y, 0 );
        const previousTotal = memo[ id ] || 0;
        memo[ id ] = previousTotal + pointsScore;

    }
    return {

        ...data,
        runningTotals: { ...memo }

    };
    
};

export default function accumulate( events, options ) {

    options = { whenKey: "when", valueKey: "score", idKey: "id", ...options };
    const { 
        
        whenKey, 
        valueKey, 
        idKey
    
    } = options;

    // events per when
    const whenIndex = events.reduce( ( index, evt ) => upsertArray(
        
        index,
        evt[ whenKey ],
        evt

    ), {} );
    
    let memo = {};
    // return accumulated data
    return Object.keys( whenIndex ).sort().map( when =>
        
        withRunningTotals( 
        
            withPoints( 
                
                {

                    when: new Date( when ).valueOf(),
                    dateWhen: new Date( when ),
                    events: whenIndex[ when ],
                    
                }, 
                idKey, 
                valueKey
            
            ),
            memo
        
        ) );

}
