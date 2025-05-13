const db = require("../db/index.js");

const createHotline = async (hotlineData) => {
    const { municipality, type, contact_number, address } = hotlineData;

    const result = await db.query(
        "INSERT INTO hotlines (municipality, type, contact_number, address) VALUES ($1, $2, $3, $4) RETURNING *", [municipality, type, contact_number, address]
    );
    return result.rows[0];
};

const editHotline = async (hotlineId, hotlineData) => {
    const { municipality, type, contact_number, address } = hotlineData;

    const result = await db.query(
        "UPDATE hotlines SET municipality = $1, type = $2, contact_number = $3, address = $4 WHERE id = $5 RETURNING *", [municipality, type, contact_number, address, hotlineId]
    );
      return result.rows[0];
};

const deleteHotline = async (hotlineId) => {
  const result = await db.query(
    "DELETE FROM hotlines WHERE id = $1 RETURNING *",
    [hotlineId]
  );

  return result.rows[0];
};

const getAllHotlines = async () => {
    const result = await db.query("SELECT * FROM hotlines");
    return result.rows;
};

const getHotlineById = async (hotlineId) => {
  const result = await db.query("SELECT * FROM hotlines WHERE id = $1", [
    hotlineId,
  ]);
  return result.rows[0];
};

module.exports = {
    createHotline,
    editHotline,
    deleteHotline,
    getAllHotlines,
    getHotlineById,
};