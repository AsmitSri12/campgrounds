const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campgrounds');

const dbUrl = process.env.DB_URL ? process.env.DB_URL + 'Campground-data' : 'mongodb://127.0.0.1:27017/Campground-data';

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await mongoose.connect(dbUrl);
    console.log("CONNECTION OPEN!!!");
    
    console.log("Deleting existing campgrounds...");
    await Campground.deleteMany({});
    
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const images = [
            {
                url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=60',
                filename: 'Yelpcamp/stars'
            },
            {
                url: 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=800&q=60',
                filename: 'Yelpcamp/forest'
            },
            {
                url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=60',
                filename: 'Yelpcamp/lake'
            },
            {
                url: 'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=800&q=60',
                filename: 'Yelpcamp/fire'
            },
            {
                url: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?auto=format&fit=crop&w=800&q=60',
                filename: 'Yelpcamp/mountain'
            }
        ];

        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '69f50ae4ae802ed008e05f08',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            images: [sample(images)]
        });
        await camp.save();
        if (i % 10 === 0) console.log(`Created ${i + 1} campgrounds...`);
    }
    console.log("Done seeding!");
}

seedDB()
    .then(() => mongoose.connection.close())
    .catch(err => {
        console.log("ERROR:", err);
        mongoose.connection.close();
    });