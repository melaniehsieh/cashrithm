import React, { useContext } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Landing from "./components/Landing/Landing";
import AddReport from "./components/Report/Add/AddReport";
import AddCategories from "./components/Report/Add/AddCategories";
import ReportList from "./components/Report/ReportList";
import Summary from "./components/Report/Summary/Summary";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { FetchProvider } from "./context/FetchContext";

const AuthenticatedRoute = ({ children, ...rest }) => {
  const authContext = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={() =>
        authContext.isAuthenticated() ? children : <Redirect to="/login" />
      }
    />
  );
};
/*
const AdminRoute = ({children, ...rest}) => {
  const authContext = useContext(AuthContext);
  
  return (
    <Route {...rest} render={() => authContext.isAuthenticated() && authContext.isAdmin() ? children : <Redirect to="/login" /> }
    />
  );
}
*/
const Routers = () => {
  return (
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <AuthenticatedRoute exact path="/reports">
        <ReportList />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/add">
        <AddReport />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/category">
        <AddCategories />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/summary/:id">
        <Summary />
      </AuthenticatedRoute>
    </Switch>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AuthProvider>
          <FetchProvider>
            <Routers />
          </FetchProvider>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
