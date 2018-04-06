import React from "react";

const defaultFormatTooltipDate = x => new Date( x ).toLocaleDateString();
const TimeSeriesTooltip = ( { payload, series, formatTooltipDate } ) => {


    const firstPayload = payload && payload[ 0 ] && payload[ 0 ].payload;
    if ( !firstPayload ) { return null; }
    const { dateWhen, runningTotals } = firstPayload;
        
    return (

        <div className="tooltip">

            <p className="when">{ ( formatTooltipDate || defaultFormatTooltipDate )( dateWhen ) }</p>    
            { series
                .map( s => ( { ...s, total: runningTotals[ s.id ] || 0 } ) )
                .sort( ( a, b ) => a.total > b.total ? -1 : a.total < b.total ? 1 : 0 )
                .map( s => 
            
                    <p className="scores" key={ s.id }>

                        <span className="score-name">{ s.name }</span>
                        <span className="score-score">{ s.total }</span>

                    </p>

                ) 
            }

        </div>
    
    );

};

export default TimeSeriesTooltip;