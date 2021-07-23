const express = require('express');
const wishlistController = require('../controllers/wishlist.controller');

const router = express.Router();

/**
    @desc   Add Movie to Wishlist 
    @route  POST /api/v1/wishlist
    @access Public
*/
router.post('/add-movie', wishlistController.saveToWishlist);

/**
    @desc   Fetch All Movies in Wishlist
    @route  GET /api/v1/wishlist
    @access Public
*/
router.get('/fetch-all', wishlistController.fetchAll);

/**
 *  @desc   Remove movie from wishlist
 *  @route  DEL /api/v1/wishlist
 *  @access Public
 */
router.delete('/:movieId', wishlistController.removeFromWishlist);

module.exports = router;