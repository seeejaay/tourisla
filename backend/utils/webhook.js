const axios = require("axios");
require("dotenv").config();

const createPayMongoWebhook = async () => {
  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/webhooks",
      {
        data: {
          attributes: {
            url: "https://tourisla.com/api/v1/paymongo/webhook", 
            events: ["link.payment.paid"],
          },
        },
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization:
            "Basic " +
            Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64"),
        },
      }
    );

    console.log("Webhook created: ", response.data.data);
    return response.data.data; 
  } catch (error) {
    console.error("Failed to create webhook: ", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { createPayMongoWebhook };