import React from "react";
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import ButtonAppBar from "./HeaderComponent/Navigation";
import Main from "./MainPage/main";
import ImageInfo from "./ImageInfoAndComments/main"
import GiveMeTopComments from "./GiveMeTopComments/main"

class App extends React.Component{
  state = {
    authState: false
  };
  updateData = (value) => {
    this.setState({ authState: value })
  }
  render() {
    return (
        <Router>
          <div>
            <ButtonAppBar AuthStatus={this.state.authState} updateData={this.updateData}/>
            <Switch>
              <Route exact path="/">
                <Main/>
              </Route>
              <Route exact path="/image/:imgdata">
                <ImageInfo/>
              </Route>
              <Route exact path="/topcomment">
                <GiveMeTopComments/>
              </Route>
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
