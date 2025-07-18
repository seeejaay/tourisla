export async function fetchRegions() {
  const res = await fetch("https://psgc.gitlab.io/api/regions/");
  const regions = await res.json();
  // Add Metro Manila manually
  console.log("Fetched Regions:", regions);
  return regions;
}

export async function fetchCities() {
  const res = await fetch(`https://psgc.gitlab.io/api/cities/`);
  const cities = await res.json();
  console.log("Fetched Cities:", cities);
  return cities;
}
