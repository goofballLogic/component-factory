import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Graph1 from "./Graph1";
import Graph2 from "./Graph2";

const App = () => (

	<Router>
    <main>

      <nav>

        <Link to="/">Home</Link>
        <Link to="/graph-1">Graph 1</Link>
        <Link to="/graph-2">Graph 2</Link>

      </nav>
      <Route path="/graph-1" component={Graph1} />
      <Route path="/graph-2" component={Graph2} />

    </main>
  </Router>

);

export default App;