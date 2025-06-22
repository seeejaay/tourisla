const {
  getActivePrice,
  createPrice,
  togglePriceStatus
} = require("../models/priceManageModel");

const getActivePriceController = async (req, res) => {
  try {
    const price = await getActivePrice();
    res.status(200).json(price || { amount: 0, is_enabled: false });
  } catch (err) {
    console.error("Get price error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const createPriceController = async (req, res) => {
  try {
    const { amount, is_enabled } = req.body;
    const price = await createPrice({ amount, is_enabled });
    res.status(201).json({ message: "Price set", price });
  } catch (err) {
    console.error("Create price error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const togglePriceController = async (req, res) => {
  try {
    const { is_enabled } = req.body;
    const updated = await togglePriceStatus(is_enabled);
    res.status(200).json({ message: "Payment status updated", updated });
  } catch (err) {
    console.error("Toggle price error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getActivePriceController,
  createPriceController,
  togglePriceController
};
