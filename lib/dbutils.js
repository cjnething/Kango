var Shelter = require('../app/models/shelter');
var Donation = require('../app/models/donation')

exports.createShelter = function(sheltername, data, callback) {
  var shelter = new Shelter({
    sheltername: sheltername,
    name: data.name,
    image_url: data.imageUrl,
    address_1: data.address1,
    address_2: data.address2,
    city: data.city,
    state: data.state,
    zip: data.zip,
    email: data.email,
    telephone: data.telephone,
    bio: data.bio,
    goal: data.goal,
    raised: 0
  });

  shelter.save().then(function(newShelter) {
    callback(newShelter);
  });
};
exports.createDonation = function(data, callback) {
  var donation = new Donation({
    sheltername: data.sheltername,
    username: data.username,
    donation: data.donation
  });

  donation.save().then(function(newDonation) {
    callback(newDonation);
  });
}