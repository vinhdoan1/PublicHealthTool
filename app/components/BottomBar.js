var React = require('react');


class BottomBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    var findingGilImg = require('../images/FindingGilLogo.png');
    var globalTiesImg = require('../images/GlobalTiesLogo.png');

// ....

    return (
      <div className = 'bottom-container'>
          <div className = "left-bottom">
            <p>Made By:</p>
            <a href="https://github.com/vinhdoan1/PublicHealthTool">
              <img src={findingGilImg}/>
            </a>
          </div>
          <div className = "right-bottom">
            <p>In Association With:</p>
            <a href="http://globalties.ucsd.edu/">
              <img src={globalTiesImg}/>
            </a>
          </div>
      </div>
    )
  }
}

module.exports = BottomBar;
