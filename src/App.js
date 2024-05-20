import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./component/Login";
import './styles.css'
import AuthComponent from "./component/AuthComponent";

function App() {
    return (
        <div className="App">
            <Router>

                <Switch>
                    <Route exact path="/">
                        <Login />
                    </Route>
                    <Route exact path="/home">
                        <AuthComponent />
                    </Route>


                </Switch>
            </Router>

        </div>
    );
}

export default App;
