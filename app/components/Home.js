var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var HealthNav = require('./Nav');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavDropdown = require('react-bootstrap').NavDropdown;
var InputGroup = require('react-bootstrap').InputGroup;
var Glyphicon = require('react-bootstrap').Glyphicon;
var FormControl = require('react-bootstrap').FormControl;
var ListGroup = require('react-bootstrap').ListGroup;
var MenuItem = require('react-bootstrap').MenuItem;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var Accordion = require('react-bootstrap').Accordion;
var Modal = require('react-bootstrap').Modal;
var Panel = require('react-bootstrap').Panel;
var MapsApiKey = require('../../config').googlemapsapikey;
var api = require('../utils/api.js');

import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;
const radiusSize = 20;

class SimpleMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      map: undefined,
      heatmap: undefined,
      mapsApi: undefined,
      mapCenter: {lat: 28.29406, lng: 84.034008},
      search: "",
      data: [],
      categories: [],
      tags: [],
      points: [],
      categoriesAfflictionsList: {},
      chosenAfflictions: [],
      chosenCategory: "",
      categoryModal: false,
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

  //take datas array and create array of categories
  extractcategoriesAfflictionsList(datas, categories)
  {
    let result = [];
    let categsObj = {};
    let categs = [];
    let categAfflictions = {}; // category are key, affliction list is value
    for (var i = 0; i < datas.length; i++) {
      var categ = datas[i].type;
      if (categ in categsObj)
      {
        categsObj[categ]++;
        categAfflictions[categ].push([datas[i].affliction, datas[i].name])
      }
      else
      {
        categsObj[categ] = 1;
        categAfflictions[categ]= [[datas[i].affliction, datas[i].name]]
      }

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
    result[0] = categs;
    result[1] = categAfflictions;
    return result;
  }

  // when component is created
  componentDidMount(){
    //fetch data
    api.getAllData()
    .then(
      function (data) {
        var res = this.extractcategoriesAfflictionsList(data)
        var categories = res[0];
        var categoriesAfflictionsList = res[1];
        this.setState(function () {
          return {
            categories: categories,
            data:data,
            categoriesAfflictionsList
          }
        });
      }.bind(this));
  }

  initHeatMap(points)
  {
    return new this.state.mapsApi.visualization.HeatmapLayer({
      data: points.map(point => (
        {location: new this.state.mapsApi.LatLng(point['location'][0], point['location'][1]),
        weight: point['weight']})),
      map: this.map,
      opacity: .8,
      radius: radiusSize,
    });
  }

  // on change for search bar
  handleSearch(e)
  {
    var result = e.target.value;
    this.setState(function () {
      return {
        search: result,
      }
    });
  }

  // onClick for affliction
  handleAfflictionClick(type, affliction)
  {
    api.getMapDataFromAffliction(type, affliction)
      .then(
        function (mapPoints) {
          var map = this.state.map;
          this.state.heatmap.setMap(null);  // delete old heatmap layer
          var heatmap = this.initHeatMap(mapPoints);
          heatmap.setMap(map);
          this.state.heatmap = heatmap;

          this.setState(function() {
            return {
              points: mapPoints,
              map: map,
              heatmap: heatmap
            }
          });
        }.bind(this));
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
    var points = [];

    var search = this.state.search.toLowerCase();

    let afflictionsListGroupItems  = this.state.chosenAfflictions.map(function(aff, i){
      return (<ListGroupItem key={aff.name} onClick={() => {
        this.handleAfflictionClick(this.state.chosenCategory, aff[0]);
        this.setState({ categoryModal: false });}}>{aff[1]}</ListGroupItem>);
    }.bind(this));

    //generate categories list (right side)
    let panelAccordian = this.state.categories.map(function(categ, i) {
      var categAfflictions = this.state.categoriesAfflictionsList[categ.name];
      var filteredData = categAfflictions.filter(function(data){
        //check whether search term in name
        return (data[1].toLowerCase().indexOf(search) >= 0);
      })

      var filteredDataShort = filteredData.filter(function(data, i) {
        return i < 5;
      });

      let singleAccord = filteredDataShort.map(function(data,i){
          return (<ListGroupItem key={i} onClick={() => {this.handleAfflictionClick(categ.name, data[0])}}>{data[1]}</ListGroupItem>)
      }.bind(this));


      return (
          <Panel bsStyle="primary" header={categ.name + " (" + filteredData.length + ")"} eventKey={i} key={i}>
            <ListGroup fill>
              {singleAccord}
              {
                (filteredData.length > 5) &&
                <ListGroupItem key={6} bsStyle="info" onClick={()=> this.setState({ categoryModal: true, chosenAfflictions: filteredData, chosenCategory: categ.name })}>Show All</ListGroupItem>
              }
            </ListGroup>
          </Panel>
      );
    }.bind(this));

    //generate categories list for mobile (right side)
    let mobileNavBars = this.state.categories.map(function(categ, i) {
      var categAfflictions = this.state.categoriesAfflictionsList[categ.name];
      var filteredData = categAfflictions.filter(function(data){
        //check whether search term in name
        return (data[1].toLowerCase().indexOf(search) >= 0);
      })

      var filteredDataShort = filteredData.filter(function(data, i) {
        return i < 5;
      });

      //for mobile bar
      let singleNav = filteredDataShort.map(function(data, i) {
        return (<MenuItem key={i} onClick={() => {this.handleAfflictionClick(categ.name, data[0])}}>{data[1]}</MenuItem>);
      }.bind(this))

      return (
          <NavDropdown eventKey={i} key={i} title={categ.name + " (" + filteredData.length + ")"} id="basic-nav-dropdown">
            {singleNav}
            {
              (filteredData.length > 5) &&
              <MenuItem key={6} onClick={()=> this.setState({ categoryModal: true, chosenAfflictions: filteredData, chosenCategory: categ.name })}><i>Show All</i></MenuItem>
            }
          </NavDropdown>
      );
    }.bind(this));

    // popups when you hover over heatmap points
    let popups = this.state.points.map( function(point){
      var divSize = radiusSize * 1.6;
      return (<div
      lat={point.location[0]}
      lng={point.location[1]}>
        <OverlayTrigger trigger={['hover', 'focus', 'click']} rootClose placement="bottom" overlay={(<Tooltip id="tooltip">{"District: " + point.districtName} <br/> {"Weight: " + point.weight}</Tooltip>)}>
            <div style={{
                width: divSize + 'px',
                height: divSize + 'px',
                position: 'absolute',
                top: divSize / -2 + 'px',
                right: divSize / -2 + 'px'}}></div>
        </OverlayTrigger>
      </div>);
    }.bind(this));

    return (
      <div className="home-google-maps">
        <Row className="search-mobile-row">
            <Col lgHidden mdHidden smHidden xs={12}>
              <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                  <Navbar.Brand>
                    <InputGroup>
                      <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
                      <FormControl
                        type="text"
                        label="Text"
                        placeholder="Search"
                        onChange={this.handleSearch}/>
                      </InputGroup>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                  <Nav>
                    {mobileNavBars}
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </Col>
          </Row>
        <Row className="home-row">
          <Col className="home-map-col"  sm={9} xs={12} md={9}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: MapsApiKey,
              libraries: 'visualization',
            }}
            defaultCenter={this.state.mapCenter}
            defaultZoom={7}
            options={{mapTypeControl: true, fullscreenControl: true}}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({map, maps}) => {
              let heatmap = new maps.visualization.HeatmapLayer({
                data: points.map(point => (
                  {location: new maps.LatLng(point['location'][0], point['location'][1]),
                  weight: point['weight']})),

              });

              this.state.map = map;
              this.state.heatmap = heatmap;
              this.state.mapsApi = maps;
            }}
          >
          {popups}
          <div
          lat={28.29406}
          lng={84.034008}>
            <OverlayTrigger trigger={['hover', 'focus', 'click']} rootClose placement="bottom" overlay={(<Tooltip id="tooltip">{"District: Blah"} <br/> {"Value: 10"}</Tooltip>)}>
                <div style={{width: '10px', height: '10px'}}></div>
            </OverlayTrigger>
          </div>
          </GoogleMapReact>
          </Col>
          <Col className="home-search-col" xsHidden sm={3} md={3}>
             <InputGroup>
               <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
               <FormControl
                 type="text"
                 label="Text"
                 placeholder="Search"
                 onChange={this.handleSearch}/>
               </InputGroup>

               <Accordion className="home-categories-accord">
               {panelAccordian}
               </Accordion>

               <Modal show={this.state.categoryModal} onHide={()=> this.setState({ categoryModal: !this.state.categoryModal })}>
               <Modal.Header closeButton>
               <Modal.Title>{this.state.chosenCategory}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
               <ListGroup fill>
               {afflictionsListGroupItems}
               </ListGroup>
               </Modal.Body>
               </Modal>
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
        <HealthNav
          selected = {0}
          history={this.props.history}
        />
        <SimpleMap/>
      </div>
    )
  }
}

module.exports = Home;
