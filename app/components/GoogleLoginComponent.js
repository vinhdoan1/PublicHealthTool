var React = require('react');
import GoogleLogin from 'react-google-login';
import { connect } from "react-redux";
import { login } from "../actions/";
import { logout } from "../actions/";
import ReactSVG from 'react-svg'
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;


const otherEmails = []

@connect((store) => {
  //console.log(store)
  return {
    googleuser: store.google
  }
})
class GoogleLoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleLogIn = this.handleLogIn.bind(this);
  }

   onSignIn(response) {
    console.log(response)
  }

  handleLogIn(response){
   var email = response.profileObj.email
   var emailAccount = email.substring(email.indexOf("@") + 1);

    var user = {
      isOneStep: (emailAccount === "onestepprojects.org" || emailAccount === "ucsd.edu" || otherEmails.indexOf(email) != -1),
      firstName: response.profileObj.givenName,
      lastName: response.profileObj.familyName,
    }
    this.props.dispatch(login(user))
  }

  render() {
  //  console.log(this.props.googleuser);
    let notOneStep = "Please Sign With OneStep Email"
    let fullName = this.props.googleuser.firstName + " " + this.props.googleuser.lastName;
    let loggedIn = this.props.googleuser.loggedIn;
    let isOneStep = this.props.googleuser.isOneStep;
    let topComponent;

    // change components based on loggedin or is onestep member
    if (!loggedIn)
    {
      topComponent = (<div className="google-top"><GoogleLogin
                      clientId="271751949636-2tb81dnvdp1cao4392rls4029uh553rl.apps.googleusercontent.com"
                      buttonText="Login"
                      className="google-login-btn"
                      onSuccess={this.handleLogIn}
                      onFailure={this.handleLogIn}>
                      <img src={require('../images/btn_google_signin_dark_normal_web.png')} />
                    </GoogleLogin></div>)
    }
    else {
      let nameSection;
      if (isOneStep)
      {
        nameSection = (<p>{"Welcome " + fullName}</p>)
      }
      else {
        nameSection = (<p>{notOneStep}</p>)
      }
      topComponent = (
        <div className="google-top">
          {nameSection}
          <Button bsSize="small" onClick={() => {this.props.dispatch(logout())}}>
            <Glyphicon glyph="off" />
          </Button>
        </div>
      )
    }

    return (
      <div className = 'google-login-button'>
        {topComponent}
      </div>
    )
  }
}

module.exports = GoogleLoginComponent;
