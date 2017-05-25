var React = require('react');
var Nav = require('./Nav');
var MapsApiKey = require('../../config').googlemapsapikey;

import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;


class SimpleMap extends React.Component {

  render() {
    var points = [];
    for (var i = 0; i < 30; i++)
    {
      var point = {
        location: [(Math.random() * 3), (Math.random() * 3)],
        weight: (Math.random() * 100)
      }
      points.push(point)
    }
    return (
      <div className="health-google-maps">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: '',
          libraries: 'visualization',
        }}
        defaultCenter={{lat: 2.5, lng: 2.5}}
        defaultZoom={6}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({map, maps}) => {
          const heatmap = new maps.visualization.HeatmapLayer({
            data: points.map(point => (
              {location: new maps.LatLng(point['location'][1], point['location'][0]),
              weight: point['weight']}))
          });
          heatmap.setMap(map);
        }}
      >
        <AnyReactComponent
          lat={59.955413}
          lng={30.337844}
          text={'Kreyser Avrora'}
        />
      </GoogleMapReact>
      </div>
    );
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  //  this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    console.log(MapsApiKey);
    return (
      <div className = 'home-container'>
        <Nav
          selected = {0}
          history={this.props.history}
        />
        <SimpleMap/>
      </div>
    )
  }
}

module.exports = Home;
