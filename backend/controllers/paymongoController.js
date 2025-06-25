const {
  createPayMongoLink,
  saveIslandEntryPayment,
  updateIslandEntryPaymentStatus,
} = require("../models/paymongoModel");

const { getIslandEntryByCode } = require("../models/islandEntryRegisModel");
const db = require("../db/index");

// Create PayMongo checkout link
const createIslandEntryPaymentLink = async (req, res) => {
  try {
    const { unique_code } = req.body;

    if (!unique_code) {
      return res.status(400).json({ error: "Unique code is required" });
    }

    const registration = await getIslandEntryByCode(unique_code.trim().toUpperCase());

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    if (registration.payment_status !== "PENDING") {
      return res.status(400).json({ error: "Payment not pending or already processed" });
    }

    const groupCountResult = await db.query(
      `SELECT COUNT(*) FROM island_entry_registration_members WHERE registration_id = $1`,
      [registration.id]
    );

    const groupCount = parseInt(groupCountResult.rows[0].count);
    const description = `Island Entry Fee for ${groupCount} person(s)`;
    const amount = parseFloat(registration.total_fee);

    const paymongoData = await createPayMongoLink({
      amount,
      referenceNumber: registration.unique_code,
      description,
    });

    if (!paymongoData || !paymongoData.attributes?.checkout_url) {
      return res.status(500).json({ error: "Failed to get checkout URL from PayMongo" });
    }

    await saveIslandEntryPayment({
      registration_id: registration.id,
      payment_link: paymongoData.attributes.checkout_url,
      status: paymongoData.attributes.status.toUpperCase(),
      amount,
      reference_num: paymongoData.attributes.reference_number,
    });

    return res.status(200).json({
      message: "PayMongo link created",
      checkout_url: paymongoData.attributes.checkout_url,
    });
  } catch (error) {
    console.error("Create PayMongo Link Error:", error?.response?.data || error.message || error);
    return res.status(500).json({ error: "Failed to create PayMongo payment link" });
}
};

const handlePayMongoWebhook = async (req, res) => {
  console.log("Webhook endpoint hit");
  try {
    const eventType = req.body?.data?.attributes?.type;
    console.log("Event type:", eventType);

    if (eventType !== "link.payment.paid") {
      console.log("Ignored non-payment event");
      return res.status(200).json({ message: "Event ignored" });
    }

    const referenceNumber = req.body?.data?.attributes?.data?.attributes?.reference_number;
    const status = req.body?.data?.attributes?.data?.attributes?.status;

    if (!referenceNumber || !status) {
      console.error("Invalid payload — missing reference number or status");
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    console.log("Reference Number:", referenceNumber);
    console.log("Payment Status:", status);

    const normalizedRef = referenceNumber.trim();
    const registration = await getIslandEntryByCode(normalizedRef);

    if (!registration) {
      console.error("No registration found for reference:", normalizedRef);
      return res.status(404).json({ error: "Registration not found" });
    }

    const newStatus = status === "paid" ? "PAID" : "PENDING";
    console.log(`Updating status to '${newStatus}' for registration_id: ${registration.id}`);

    await updateIslandEntryPaymentStatus({
      registration_id: registration.id,
      status: newStatus,
    });

    console.log("Payment status updated successfully");
    return res.status(200).json({ message: "Payment status updated" });
  } catch (error) {
    console.error("PayMongo Webhook Error:", error.message);
    console.error(error.stack);
    return res.status(500).json({ error: error.message, stack: error.stack }); // temporarily show real error
  }
};

// Manual payment confirmation for testing (call this in Postman)
const manuallyConfirmPayment = async (req, res) => {
  try {
    const { unique_code } = req.body;

    if (!unique_code) {
      return res.status(400).json({ error: "Unique code is required" });
    }

    const registration = await getIslandEntryByCode(unique_code.trim().toUpperCase());

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    await updateIslandEntryPaymentStatus({
      registration_id: registration.id,
      status: "PAID",
    });

    return res.status(200).json({ message: "Payment status manually updated to PAID" });
  } catch (error) {
    console.error("Manual Payment Confirmation Error:", error);
    res.status(500).json({ error: "Failed to manually confirm payment" });
  }
};

module.exports = {
  createIslandEntryPaymentLink,
  handlePayMongoWebhook, 
  manuallyConfirmPayment,
};
