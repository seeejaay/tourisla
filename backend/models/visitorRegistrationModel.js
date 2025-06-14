const db = require("../db/index");

const createVisitorRegistration = async ({ unique_code, qr_code_url }) => {
  const result = await db.query(
    `INSERT INTO visitor_registrations (unique_code, qr_code_url) 
     VALUES ($1, $2) RETURNING *`,
    [unique_code, qr_code_url]
  );
  return result.rows[0];
};

const createVisitorGroupMembers = async (registrationId, members) => {
  const promises = members.map((member) =>
    db.query(
      `INSERT INTO visitor_group_members 
      (registration_id, name, age, sex, place_of_residence)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        registrationId,
        member.name,
        member.age,
        member.sex,
        member.place_of_residence,
      ]
    )
  );

  const results = await Promise.all(promises);
  return results.map((res) => res.rows[0]);
};

module.exports = {
  createVisitorRegistration,
  createVisitorGroupMembers,
};
