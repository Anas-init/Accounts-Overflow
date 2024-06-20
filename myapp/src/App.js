import DashView from "./components/dashboard";
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Switch>
            <Route exact path='/'>
              <DashView/>
            </Route>
          </Switch>
        </Router>
        
      </header>
    </div>
  );
}

export default App;
