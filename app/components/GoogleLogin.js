var React = require('react');


let onSignIn = (googleUser) => {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

class GoogleLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.onSignIn = this.onSignIn.bind(this);
  }

   onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }


  render() {
    return (
      <div className = 'google-login-button'>
          <div id="g-signin2" data-onsuccess={this.onSignIn} />
          <div className="g-signin2" data-onsuccess={() => {console.log("HI")}}></div>
      </div>
    )
  }
}

GoogleLogin.propTypes = {
};

module.exports = GoogleLogin;
