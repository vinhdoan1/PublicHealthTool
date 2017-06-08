var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Nav = require('./Nav');
var InputGroup = require('react-bootstrap').InputGroup;
var Glyphicon = require('react-bootstrap').Glyphicon;
var FormControl = require('react-bootstrap').FormControl;
var MapsApiKey = require('../../config').googlemapsapikey;

import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;


class SimpleMap extends React.Component {

  genRandPoints(center, variance, numPoints) {
    var pList = [];
  
    for (var i = 0; i < numPoints; i++)
    {
      var point = {
        location: [center[0] + (Math.random() * variance - variance/2), center[1] + (Math.random() * variance - variance/2)],
        weight: (Math.random() * 100)
      }
      pList.push(point)
    }

    return pList;
  }

  render() {
    const mapCenter = [28.29406, 84.034008];
    const centerWest = [29.29406, 82.034008];
    const centerEast = [27.29406, 86.034008];
    var pointsWest = this.genRandPoints(centerWest, 2, 50);
    var pointsEast = this.genRandPoints(centerEast, 2, 50);
    var points = [];
    points = pointsWest.concat(pointsEast);

    return (
      <div className="health-google-maps">
        <Row className="map-row">
          <Col xs={2} md={3}>
             <InputGroup>
               <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
               <FormControl
                 type="text"
                 label="Text"
                 placeholder="Search"
                 onChange={this.handleSearch}/>
               </InputGroup>
          </Col>
          <Col className="map-col" xs={10} md={9}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: MapsApiKey,
              libraries: 'visualization',
            }}
            defaultCenter={{lat: mapCenter[0], lng: mapCenter[1]}}
            defaultZoom={7}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({map, maps}) => {
              const heatmap = new maps.visualization.HeatmapLayer({
                data: points.map(point => (
                  {location: new maps.LatLng(point['location'][0], point['location'][1]),
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
          </Col>
        </Row>
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
