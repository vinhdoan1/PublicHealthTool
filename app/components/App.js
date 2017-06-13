var React = require('react');
var ReactRouter = require('react-router-dom');
var Router = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;
var Switch = ReactRouter.Switch;
var Data = require('./Data');
var Home = require('./Home');
var Input = require('./Input');
var DataPage = require('./DataPage');
var BottomBar = require('./BottomBar');



class App extends React.Component {
  render() {
    return (
      <Router>
        <div className='container'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/data' component={Data} />
            <Route path ='/data/display' component={DataPage} />
            <Route path='/input' component={Input} />
            <Route render={function () {
              return <p>Not Found</p>
            }} />
          </Switch>
          <BottomBar/>
        </div>
      </Router>
    )
  }
}

module.exports = App;
