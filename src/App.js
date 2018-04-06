import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Graph7 from "./Graph7";

const App = () => (

	<Router>
    <main>

      <nav>

        <Link to="/">Home</Link>
        <Link to="/graph-7">Graph (7)</Link>

      </nav>
      <Route path="/graph-7" component={Graph7} />

    </main>
  </Router>

);

export default App;