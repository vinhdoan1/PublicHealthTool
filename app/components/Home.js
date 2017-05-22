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

        const center_point = [27.980626, 84.578747];
        const positions = [ [27.98, 84.57, "574"],
                            [27.97, 84.56, "450"] ];

        return (
          <div className = 'home-container'>
            <Nav
              selected = {0}
              history={this.props.history}
            />
            <Map id="mapid" center={center_point} zoom={7}>

              <TileLayer
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />

              <Marker position={center_point}>
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

              /*<HeatmapLayer
                fitBoundsOnLoad
                fitBoundsOnUpdate
                points={positions}
                longitudeExtractor={m => m[1]}
                latitudeExtractor={m => m[0]}
                intensityExtractor={m => parseFloat(m[2])} />
              */

