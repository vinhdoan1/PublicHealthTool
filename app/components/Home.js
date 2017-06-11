var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Nav = require('./Nav');
var InputGroup = require('react-bootstrap').InputGroup;
var Glyphicon = require('react-bootstrap').Glyphicon;
var FormControl = require('react-bootstrap').FormControl;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var MapsApiKey = require('../../config').googlemapsapikey;
var api = require('../utils/api.js');

import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;


class SimpleMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: "",
      data: [],
      categories: [],
      tags: [],
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  //take datas array and create array of categories
  extractCategories(datas)
  {
    let categsObj = {};
    let categs = [];
    for (var i = 0; i < datas.length; i++) {
      var categ = datas[i].type;
      if (categ in categsObj)
      categsObj[categ]++;
      else
      categsObj[categ] = 1;
    }

    for (var key in categsObj) {
      categs.push({
        name: key,
        count: categsObj[key],
        isVisible: false,
      })
    }
    categs = categs.sort(function (a,b){
      return b.count - a.count;
    })
    return categs;
  }

  // when component is created
  componentDidMount(){
    //fetch data
    api.getAllData()
    .then(
      function (data) {
        var categories = this.extractCategories(data)
        this.setState(function () {
          return {
            categories: categories,
            data:data
          }
        });
      }.bind(this));
    }

  // on change for search bar
  handleSearch(e)
  {
    var result = e.target.value;
    /*var querystring = queryString.parse(this.props.location.hash);
    querystring.page = undefined;
    var hashqs = queryString.stringify(querystring)
    location.hash = '#' + hashqs;*/
    this.setState(function () {
      return {
        search: result,
      }
    });
  }

  // onClick for categories
  handleCategoriesClick(name)
  {
    var categories = this.state.categories;
    var category = undefined;

    for(var i = 0; i < categories.length; i++)
    {
      if(name == categories[i].name)
      {
        category = categories[i];
        break;
      }
    }

    category.isVisible = !category.isVisible;  // toggle visibility
    this.setState(function () {
      return {
        categories: categories
      }
    });
  }

  genRandPoints(center, variance, numPoints) {
    var pList = [];

    for (var i = 0; i < numPoints; i++)
    {
      var point = {
        location: [center[0] + (Math.random() * variance - variance/2), center[1] + (Math.random() * variance - variance/2)],
        weight: (Math.random() * 100),
        districtName: "test"
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

    var search = this.state.search.toLowerCase();

    //generate tags list (right side)
    let itemsToDisplay = this.state.categories.map(function(categ) {
    var renderList = [];
    var filteredData = [];

    filteredData = this.state.data.filter(function(data){
      return data.type == categ.name;
    })
    .filter(function(data){
      //check whether search term in name, description,tags
      return (data.name.toLowerCase().indexOf(search) >= 0) ||
      (data.type.toLowerCase().indexOf(search) >= 0) ||
      (data.description.toLowerCase().indexOf(search) >= 0);
    });

    renderList.push(<ListGroupItem className="home-category-list-item" key={categ.name} onClick={() => {this.handleCategoriesClick(categ.name);}}><font color="#EEEEEE">{categ.name + " (" + filteredData.length + ")"}</font></ListGroupItem>);

    if(categ.isVisible)
    {
      for(var i = 0; i < filteredData.length; i++)
      {
        renderList.push((<ListGroupItem className="home-tag-list-item" onClick={() => {this.handleTagClick();}}>{filteredData[i].name}</ListGroupItem>));
      }
    }

      return renderList;

    }.bind(this));

    // the lists in the format we want for displaying
    let displayList = [];
    for(var i = 0; i < itemsToDisplay.length; i++)
    {
      displayList = displayList.concat(itemsToDisplay[i]);
    }

    return (
      <div className="health-google-maps">
        <Row className="home-row">
          <Col className="home-search-col" xs={3} md={3}>
             <InputGroup>
               <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
               <FormControl
                 type="text"
                 label="Text"
                 placeholder="Search"
                 onChange={this.handleSearch}/>
               </InputGroup>
               <ListGroup className="home-categories-list" >
                 { displayList }
               </ListGroup>
          </Col>
          <Col className="home-map-col" xs={9} md={9}>
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
