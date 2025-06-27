const {
  getAllPrices,
  getActivePrice,
  createPrice,
  togglePriceStatus,
  updatePriceDetails
} = require("../models/priceManageModel");

const getAllPricesController = async (req, res) => {
  try {
    const prices = await getAllPrices();
    res.status(200).json(prices);
  } catch (err) {
    console.error("Error fetching all prices:", err);
    res.status(500).json({ error: "Failed to fetch all prices" });
  }
};

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
    const { amount, is_enabled, type } = req.body;
    const newPrice = await createPrice({ amount, is_enabled, type });
    res.status(201).json(newPrice);
  } catch (err) {
    console.error("Create price error:", err);
    res.status(500).json({ error: "Failed to create price" });
  }
};

const togglePriceController = async (req, res) => {
  try {
    const id = parseInt(req.params.id); 
    const { is_enabled } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid price ID" });
    }

    const updated = await togglePriceStatus(id, is_enabled);
    res.status(200).json({ message: "Payment status updated", updated });
  } catch (err) {
    console.error("Toggle price error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const updatePriceDetailsController = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!type || typeof type !== "string" || type.trim() === "") {
      return res.status(400).json({ error: "Invalid type" });
    }

    const updated = await updatePriceDetails(id, amount, type);

    if (!updated) {
      return res.status(404).json({ error: "Price not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update price details error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllPricesController,
  getActivePriceController,
  createPriceController,
  togglePriceController,
  updatePriceDetailsController
};
