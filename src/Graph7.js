import React from "react";
import moment from "moment";
import "./Graph7.css";
import TimeSeriesGraph from "./TimeSeriesGraph";
import { persons, events } from "./Graph7Data";

import accumulate from "./time-series";

const data = accumulate( events );
const formatTooltipDate = x => moment( x ).format( "dddd, MMMM Do" );
const formatTick = x => moment( x ).format( "Do MMM YYYY");

const Graph7 = () => (

    <div className="g7">
    
        <TimeSeriesGraph 
            series={persons} 
            data={data} 
            formatTick={formatTick} 
            formatTooltipDate={formatTooltipDate} />
    
    </div>

);
export default Graph7;

