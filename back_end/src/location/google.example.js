const googleMapsClient = require('@google/maps').createClient({
    key: "AIzaSyAt1l6XIypmIj9ABKX5SI09x76Y9FCYU4k"
});

googleMapsClient.geocode({
    address: 'Kaiser building, Vancouver, BC'
  }, function(err, response) {
    if (!err) {
      console.log(response.json.results);      
      console.log(response.json.results[0].geometry.location.lat);
      console.log(response.json.results[0].geometry.location.lng);
    }
    else{
      console.log(err);
    }
});