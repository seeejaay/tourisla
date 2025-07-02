const db = require("../db/index");

// Article CRUD
const createArticle = async (data) => {
  const {
    title,
    author,
    content,
    video_url,
    tags,
    type,
    is_published,
    is_featured,
    barangay,
    summary,
  } = data;

  const result = await db.query(
    `INSERT INTO article (
      title, author, content, video_url, tags, type,
      is_published, is_featured, barangay, summary,
      date_published, last_updated
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10,
      NOW(), NOW()
    ) RETURNING *`,
    [
      title,
      author,
      content,
      video_url,
      tags,
      type,
      is_published,
      is_featured,
      barangay,
      summary,
    ]
  );
  return result.rows[0];
};

const editArticle = async (id, data) => {
  const {
    title,
    author,
    content,
    video_url,
    tags,
    type,
    is_published,
    is_featured,
    barangay,
    summary,
  } = data;

  const result = await db.query(
    `UPDATE article SET
      title = $1,
      author = $2,
      content = $3,
      video_url = $4,
      tags = $5,
      type = $6,
      is_published = $7,
      is_featured = $8,
      barangay = $9,
      summary = $10,
      last_updated = NOW()
    WHERE id = $11
    RETURNING *`,
    [
      title,
      author,
      content,
      video_url,
      tags,
      type,
      is_published,
      is_featured,
      barangay,
      summary,
      id,
    ]
  );
  return result.rows[0];
};

const deleteArticle = async (id) => {
  await db.query(`DELETE FROM article WHERE id = $1`, [id]);
  return { message: `Article ${id} deleted` };
};

const getAllArticles = async () => {
  const result = await db.query(`SELECT * FROM article ORDER BY created_at DESC`);
  return result.rows;
};

const getArticleById = async (id) => {
  const result = await db.query(`SELECT * FROM article WHERE id = $1`, [id]);
  return result.rows[0];
};

// Images
const addArticleImages = async (articleId, imageUrls) => {
  const promises = imageUrls.map((url) =>
    db.query(
      `INSERT INTO article_images (article_id, image_url) VALUES ($1, $2) RETURNING *`,
      [articleId, url]
    )
  );
  const results = await Promise.all(promises);
  return results.map((res) => res.rows[0]);
};

const getArticleImages = async (articleId) => {
  const result = await db.query(
    `SELECT * FROM article_images WHERE article_id = $1`,
    [articleId]
  );
  return result.rows;
};

const deleteArticleImage = async (imageId) => {
  const result = await db.query(
    `DELETE FROM article_images WHERE id = $1 RETURNING *`,
    [imageId]
  );
  return result.rows[0]; // contains the image_url
};

module.exports = {
  createArticle,
  editArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  addArticleImages,
  getArticleImages,
  deleteArticleImage,
};
