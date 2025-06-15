const API_URL = process.env.NEXT_PUBLIC_API_URL2;

export const fetchWeather = async (location = "Bantayan") => {
  try {
    const res = await fetch(`${API_URL}weather?q=${location}`);
    if (!res.ok) throw new Error("Failed to fetch weather");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Weather API error:", err);
    throw err;
  }
};
