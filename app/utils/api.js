var axios = require('axios');

// for getMapDataFromAffliction return map usable data
function convertMapData(data)
{
  var mapDatas = []
  var dataRows = JSON.parse(data.Data.rows)
  for (var i = 0; i < dataRows.length; i++)
  {
    var dataRow = dataRows[i]

    var valKey = (Object.keys(dataRow).length - 3);
    var mapData = {
      districtName: dataRow[0],
      location: [dataRow.Latitude, dataRow.Longitude],
      weight: dataRow[valKey],
    };
    mapDatas.push(mapData)
  }
  return mapDatas;
}

// for getDataFromAffliction  turn cols from server to usable grid
function convertColsForGrid(cols)
{
  var gridCols = []
  for (var i = 0; i < cols.length; i++)
  {
    var key = i + "";
    if (cols[i] === "Longitude" || cols[i] === "Latitude")
      key = cols[i];
    var gridCol = {
      key: key,
      name: cols[i],
      editable: false,
      resizable: true,
    }
    gridCols.push(gridCol)
  }
  return gridCols;
}

function getCategories() {
  return axios.get('https://eng100d-project.herokuapp.com/list')
    .then(function (user) {
      return user.data;
    });
}

function getAllData() {
  return axios.get('https://eng100d-project.herokuapp.com/list/all')
    .then(function (user) {
      return user.data;
    });
}

function getDataFromAffliction(type, affliction) {
  return axios.get('https://eng100d-project.herokuapp.com/list/' + type + '/' + affliction)
    .then(function (user) {
      var data = user.data
      var cols = data.Data.cols;
      var rows = JSON.parse(data.Data.rows);
      var gridCols = convertColsForGrid(cols);
    //  var gridRows = this.convertRowsForGrid(rows);
      return {
          name: data.info.name,
          category: affliction,
          views: data.info.views,
          description: data.info.description,
          date: data.info.date,
          columns: gridCols,
          rows: rows
      }
    });
}

function getMapDataFromAffliction(type, affliction) {
  var url = 'https://eng100d-project.herokuapp.com/list/' + type + '/' + encodeURIComponent(affliction);
  console.log(url);
  return axios.get(url)
    .then(function (user) {
      return convertMapData(user.data);
    });
}

module.exports = {
  getCategories: getCategories,
  getAllData: getAllData,
  getDataFromAffliction: getDataFromAffliction,
  getMapDataFromAffliction: getMapDataFromAffliction,
};
