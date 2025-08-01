const { google } = require("googleapis");
const { oauth2Client, SCOPES } = require("../utils/calendar.js");
const {
  saveGoogleTokens,
  getGoogleTokens,
} = require("../models/calendarModel");

const { getGuideRegisById } = require("../models/guideRegisModel.js");

// FOR TOUR GUIDES ONLY
// Redirects user to Google's consent page for Calendar access
const authorizeGoogleCalendarController = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.log("No user or user.id in request:", req.user);
      return res.status(401).json({ error: "Unauthorized access." });
    }
    const userId = req.user.id;
    const guide = await getGuideRegisById(userId);
    if (!guide) {
      return res.status(404).json({ error: "Guide not found." });
    }
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
      state: JSON.stringify({ userId: guide.id }),
    });
    // Instead of res.redirect(authUrl);
    res.json({ authUrl }); // <--- Send as JSON
  } catch (err) {
    console.error("Error in authorizeGoogleCalendarController:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Handles Google’s redirect, exchanges code for tokens, saves tokens
const googleCalendarCallbackController = async (req, res) => {
  const { code, state } = req.query;
  const { userId } = JSON.parse(state);

  console.log("Google Calendar callback received for user:", userId);
  if (!code)
    return res.status(400).json({ error: "Missing authorization code." });

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    await saveGoogleTokens(userId, tokens);

    res.send("Google Calendar authorized. You can close this tab.");
  } catch (error) {
    console.error("Token exchange error:", error);
    res.status(500).json({ error: "Google authentication failed." });
  }
};

module.exports = {
  authorizeGoogleCalendarController,
  googleCalendarCallbackController,
};
