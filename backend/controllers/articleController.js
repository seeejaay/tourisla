const {
  createArticle,
  editArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
} = require("../models/articleModel.js");

const { s3Client, PutObjectCommand } = require("../utils/s3.js");

const createArticleController = async (req, res) => {
  try {
    let {
      title,
      author,
      body,
      video_url,
      tags,
      status,
      is_featured,
      updated_by,
    } = req.body;

    title = title?.toUpperCase();
    author = author?.toUpperCase();
    body = body?.toUpperCase();

    let thumbnail_url = null;

    // Upload thumbnail to S3
    if (req.file) {
      const file = req.file;
      const s3Key = `article_thumbnails/${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      thumbnail_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    }

    const article = await createArticle({
      title,
      author,
      body,
      video_url,
      thumbnail_url,
      tags,
      status,
      is_featured,
      updated_by,
    });

    res.status(201).json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const editArticleController = async (req, res) => {
  try {
    const { articleId } = req.params;
    let {
      title,
      author,
      body,
      video_url,
      thumbnail_url, // optional fallback if no new image
      tags,
      status,
      is_featured,
      updated_by,
    } = req.body;

    title = title?.toUpperCase();
    author = author?.toUpperCase();
    body = body?.toUpperCase();

    // If there's a new file, upload it and overwrite thumbnail_url
    if (req.file) {
      const file = req.file;
      const s3Key = `article_thumbnails/${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        await s3Client.send(new PutObjectCommand(uploadParams));
        thumbnail_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
      } catch (s3Err) {
        console.error("S3 upload failed:", s3Err.message);
      }
    }

    const article = await editArticle(articleId, {
      title,
      author,
      body,
      video_url,
      thumbnail_url,
      tags,
      status,
      is_featured,
      updated_by,
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const deleteArticleController = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await deleteArticle(articleId);
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const viewArticlesController = async (req, res) => {
  try {
    const articles = await getAllArticles();
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const viewArticleByIdController = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await getArticleById(articleId);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

module.exports = {
  createArticleController,
  editArticleController,
  deleteArticleController,
  viewArticlesController,
  viewArticleByIdController,
};
