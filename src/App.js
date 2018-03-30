import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Graph1 from "./Graph1";
import Graph2 from "./Graph2";
import Graph3 from "./Graph3";
import Graph4 from "./Graph4";
import Graph5 from "./Graph5";
import Graph6 from "./Graph6";
import Graph7 from "./Graph7";

const App = () => (

	<Router>
    <main>

      <nav>

        <Link to="/">Home</Link>
        <Link to="/graph-1">Graph (1)</Link>
        <Link to="/graph-2">Utils (2)</Link>
        <Link to="/graph-3">Graph (3)</Link>
        <Link to="/graph-4">Graph (4)</Link>
        <Link to="/graph-5">Graph (5)</Link>
        <Link to="/graph-6">Graph (6)</Link>
        <Link to="/graph-7">Graph (7)</Link>

      </nav>
      <Route path="/graph-1" component={Graph1} />
      <Route path="/graph-2" component={Graph2} />
      <Route path="/graph-3" component={Graph3} />
      <Route path="/graph-4" component={Graph4} />
      <Route path="/graph-5" component={Graph5} />
      <Route path="/graph-6" component={Graph6} />
      <Route path="/graph-7" component={Graph7} />

    </main>
  </Router>

);

export default App;