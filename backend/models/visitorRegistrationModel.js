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
      (registration_id, name, age, sex, is_foreign, municipality, province, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        registrationId,
        member.name,
        member.age,
        member.sex,
        member.is_foreign || false,
        member.municipality || '',
        member.province || '',
        member.country || '',
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
