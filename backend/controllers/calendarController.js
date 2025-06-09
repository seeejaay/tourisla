const { google } = require('googleapis');
const { oauth2Client, SCOPES } = require('../utils/calendar.js');
const {
  saveGoogleTokens,
  getGoogleTokens,
} = require('../models/calendarModel');

// redirect user to google consent screen
const authorizeGoogleCalendarController = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", 
    state: JSON.stringify({ userId: req.user.id }), 
  });
  res.redirect(authUrl);
};

// handle OAuth2 callback and exchange code for tokens
const googleCalendarCallbackController = async (req, res) => {
  const { code, state } = req.query;
  const { userId } = JSON.parse(state);

  if (!code) return res.status(400).json({ error: 'Missing authorization code.' });

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    await saveGoogleTokens(userId, tokens);

    res.send('Google Calendar authorized. You can close this tab.');
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'Google authentication failed.' });
  }
};

// sync booking to calendar event
const syncBookingToCalendarController = async (req, res) => {
  const tourguideId = req.user.id;
  const { title, description, startDateTime, endDateTime } = req.body;

  try {
    const tokens = await getGoogleTokens(tourguideId);

    oauth2Client.setCredentials({
      access_token: tokens.google_access_token,
      refresh_token: tokens.google_refresh_token,
      expiry_date: new Date(tokens.google_token_expiry).getTime(),
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: title,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: 'Asia/Manila',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Asia/Manila',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    res.status(200).json({
      message: 'Event created on Google Calendar.',
      eventId: response.data.id,
    });
  } catch (error) {
    console.error('Error syncing booking:', error);
    res.status(500).json({ error: 'Failed to sync to Google Calendar' });
  }
};

module.exports = {
  authorizeGoogleCalendarController,
  googleCalendarCallbackController,
  syncBookingToCalendarController,
};