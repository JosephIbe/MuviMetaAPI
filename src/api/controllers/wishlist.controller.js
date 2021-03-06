const Wishlist = require('../../models/wishlist.model');
const axios = require('axios');

module.exports = {
    fetchAll: async (req, res, next) => {
        try {
            const wishlist = await Wishlist.find({});
            
            if (wishlist == null) {
                res.status(404)
                    .json({
                        success: false,
                        msg: 'No Movies Found in Wishlist',
                        wishlist: []
                    })
            }

            const objectIds = wishlist.map((item) => item.id);
            
            const showsArr = objectIds.map( async (id) => {
                const moviesFound = await Wishlist.find({'_id': id});

                var shows;

                var data = moviesFound.map( async (movie) => {
                    shows = await axios.get(`https://api.tvmaze.com/shows/${movie.movieId}`);
                    return shows.data;
                });
                console.log(data);
                return Promise.all(data);
            });

            const wishlistItems = await Promise.all(showsArr);

            return res.status(200)
                      .json({
                        length: showsArr.length,
                        success: true,
                        msg: 'All Movies in Wishlist Fetched',
                        wishlist: Array.prototype.concat.apply([], wishlistItems)
                      })
        } catch (err) {
            console.log(err);
            next(err);
        }
    },  
    
    saveToWishlist: async (req, res, next) => {
        try {
            const { id } = req.params;
            console.log(id);

            let found = await Wishlist.findOne({'movieId': id});
            console.log(found);

            if(found) {
                return res.status(409)
                   .json({success: false, msg: 'This movie is already in your wishlist'});
            }

            const wishlist = Wishlist({movieId: id});
            console.log(`wishlist to add\n ${wishlist}`);
            const savedWishlist = await wishlist.save();
            
            return res.status(201)
                      . json({
                          msg: `Movie with id ${id} Added to Wishlist`,
                          success: true,
                          movie: savedWishlist
                      });

        } catch (err){
            console.log(err);
            next(err);
        }
    },

    removeFromWishlist: async (req, res, next) => {},

    checkMovieExistsInWishlist: async (req, res, next) => {
        try {
            const { id } = req.params;
            console.log(id);

            let found = await Wishlist.findOne({'movieId': id});
            console.log(found);

            if(found) {
                return res.status(200)
                          .json({success: true, msg: 'This movie exists in your wishlist'});
            }
            return res.status(404)
                          .json({success: false, msg: 'This movie does not exist in your wishlist'});
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
};