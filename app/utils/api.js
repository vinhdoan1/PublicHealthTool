var axios = require('axios');

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
  return axios.get('https://eng100d-project.herokuapp.com/data/' + type + '/' + affliction)
    .then(function (user) {
      return user.data;
    });
}



module.exports = {
  getCategories: getCategories,
  getAllData: getAllData,
  getDataFromAffliction: getDataFromAffliction,
};
