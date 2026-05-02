const Campground = require('../models/campgrounds');
const {cloudinary} = require('../cloudinary');
const path = require('path');

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({}).populate('author');
    const lowPriceCamp = await Campground.find({ price: { $gte: 2000 } }).limit(4).populate('author');
    res.render('campground/index', { campgrounds, lowPriceCamp });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campground/new');
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Campground Created successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.campgroundDetails = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find the Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campground/show', { campground });
}

module.exports.updateNewForm = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find the Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campground/update', { campground });
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImage) {
        for(let filename of req.body.deleteImage){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in:  req.body.deleteImage } } } } );
    }
    req.flash('success', 'Successfully Updated Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Deleted');
    res.redirect('/campgrounds');
}




  