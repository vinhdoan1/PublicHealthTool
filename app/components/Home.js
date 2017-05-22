import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import HeatmapLayer from '../../react-leaflet-heatmap-layer/src/HeatmapLayer';
var React = require('react');
var Nav = require('./Nav');

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  //  this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {

    const position = [27.980626, 84.578747];

    return (
      <div className = 'home-container'>
        <Nav
          selected = {0}
          history={this.props.history}
        />
        <Map id="mapid" center={position} zoom={7}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
             <Popup>
               <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
             </Popup>
          </Marker>
        </Map>
      </div>
    )
  }
}

module.exports = Home;
