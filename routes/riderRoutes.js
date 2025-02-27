const express = require('express');
const router = express.Router();
const {
  getAvailableOrders,
  acceptOrder,
  updateLocation,
  updateOrderStatus
} = require('../controllers/riderController');
const { protect, rider } = require('../middleware/auth');

// All routes require rider authentication
router.use(protect);
router.use(rider);

router.get('/orders', getAvailableOrders);
router.put('/orders/:id/accept', acceptOrder);
router.put('/location', updateLocation);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router; 