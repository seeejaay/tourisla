const pool = require("../db/index.js");

const createArticle = async (data) => {
  const {
    title,
    author,
    published_date,
    published_at,
    body,
    video_url,
    thumbnail_url,
    tags,
    status,
    is_featured,
    category_id,
    updated_by,
  } = data;

  const result = await pool.query(
    `INSERT INTO articles (
      title, author, published_date, published_at, body,
      video_url, thumbnail_url, tags, status, is_featured,
      category_id, updated_by, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
    ) RETURNING *`,
    [
      title,
      author,
      published_date,
      published_at,
      body,
      video_url,
      thumbnail_url,
      tags,
      status,
      is_featured,
      category_id,
      updated_by,
    ]
  );

  return result.rows[0];
};

const editArticle = async (id, data) => {
  const {
    title,
    author,
    published_date,
    published_at,
    body,
    video_url,
    thumbnail_url,
    tags,
    status,
    is_featured,
    category_id,
    updated_by,
  } = data;

  const result = await pool.query(
    `UPDATE articles SET
      title = $1,
      author = $2,
      published_date = $3,
      published_at = $4,
      body = $5,
      video_url = $6,
      thumbnail_url = $7,
      tags = $8,
      status = $9,
      is_featured = $10,
      category_id = $11,
      updated_by = $12,
      updated_at = NOW()
    WHERE id = $13
    RETURNING *`,
    [
      title,
      author,
      published_date,
      published_at,
      body,
      video_url,
      thumbnail_url,
      tags,
      status,
      is_featured,
      category_id,
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
