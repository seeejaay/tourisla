const getWeather = async (req, res) => {
  const location = req.query.q || "Bantayan";
  const API_KEY = process.env.WEATHER_API_KEY;

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`
    );

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Weather fetch error:", err);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

module.exports = {
  getWeather,
};
