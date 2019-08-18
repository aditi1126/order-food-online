import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";

import DashboardContainer from "../src/routes/dashboard/DashboardContainer";
import WelcomeScreen from "./routes/common/WelcomeScreen";
import OrderSuccessfulScreen from "./routes/common/OrderSuccessfulScreen";
import './App.css';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Route exact path="/" component={WelcomeScreen} />
      <Route exact path="/order-food-online" component={DashboardContainer} />
        <Route exact path="/order-placed" component={OrderSuccessfulScreen} />
      </BrowserRouter>
    </div>
  );
}

export default App;
