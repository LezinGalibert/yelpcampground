const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedsHelper');

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++){
        const randomIdx = Math.floor(Math.random() * 1000);
        const newCG = new Campground({
          location: `${cities[randomIdx]['city']} - ${cities[randomIdx]['state']}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          images: [{ url: 'https://source.unsplash.com/collection/583204', filename: 'filename' }],
          description: 'Lorem ipsum',
          price: Math.floor(Math.random() * 100) + 10,
          author: '649adac705cb2114a1706650',
        });
        await newCG.save();
    }
}

seedDB().then(() => {
  mongoose.connection.close();
});
