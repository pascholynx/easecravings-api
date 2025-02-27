const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get all available orders for rider
// @route   GET /api/rider/orders
// @access  Private (Rider only)
const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: 'ready',
      rider: null
    }).populate('user', 'name phone');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept order by rider
// @route   PUT /api/rider/orders/:id/accept
// @access  Private (Rider only)
const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.rider) {
      return res.status(400).json({ message: 'Order already assigned to a rider' });
    }

    order.rider = req.user.id;
    order.status = 'assigned_to_rider';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update rider's current location
// @route   PUT /api/rider/location
// @access  Private (Rider only)
const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    const rider = await User.findByIdAndUpdate(
      req.user.id,
      {
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      },
      { new: true }
    );

    res.json(rider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order status by rider
// @route   PUT /api/rider/orders/:id/status
// @access  Private (Rider only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      rider: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!['picked_up', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAvailableOrders,
  acceptOrder,
  updateLocation,
  updateOrderStatus
}; 