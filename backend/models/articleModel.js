const pool = require("../db/index.js");

// CREATE ARTICLE
const createArticle = async (data) => {
  const {
    title,
    author,
    body,
    video_url,
    thumbnail_url,
    tags,
    status,
    is_featured,
    updated_by,
  } = data;

  const result = await pool.query(
    `INSERT INTO articles (
      title,
      author,
      body,
      video_url,
      thumbnail_url,
      tags,
      status,
      is_featured,
      updated_by,
      created_at,
      updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()
    ) RETURNING *`,
    [
      title,
      author,
      body,
      video_url,
      thumbnail_url,
      tags,
      status,
      is_featured,
      updated_by,
    ]
  );

  return result.rows[0];
};

// EDIT ARTICLE
const editArticle = async (id, data) => {
  const {
    title,
    author,
    body,
    video_url,
    thumbnail_url,
    tags,
    status,
    is_featured,
    updated_by,
  } = data;

  const result = await pool.query(
    `UPDATE articles SET
      title = $1,
      author = $2,
      body = $3,
      video_url = $4,
      thumbnail_url = $5,
      tags = $6,
      status = $7,
      is_featured = $8,
      updated_by = $9,
      updated_at = NOW()
    WHERE id = $10
    RETURNING *`,
    [
      title,
      author,
      body,
      video_url,
      thumbnail_url,
      tags,
      status,
      is_featured,
      updated_by,
      id,
    ]
  );

  return result.rows[0];
};

const deleteArticle = async (id) => {
  await pool.query(`DELETE FROM articles WHERE id = $1`, [id]);
  return { message: `Article ${id} deleted` };
};

const getAllArticles = async () => {
  const result = await pool.query(`SELECT * FROM articles`);
  return result.rows;
};

const getArticleById = async (id) => {
  const result = await pool.query(`SELECT * FROM articles WHERE id = $1`, [id]);
  return result.rows[0];
};

module.exports = {
  createArticle,
  editArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
};
