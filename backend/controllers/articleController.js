const {
  createArticle,
  editArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
} = require("../models/articleModel.js");

const createArticleController = async (req, res) => {
  try {
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
      updated_by,
    } = req.body;

    const article = await createArticle({
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
      updated_by,
    });

    res.json(article);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const editArticleController = async (req, res) => {
  try {
    const { articleId } = req.params;
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
      updated_by,
    } = req.body;

    const article = await editArticle(articleId, {
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
      updated_by,
    });

    res.json(article);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const deleteArticleController = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await deleteArticle(articleId);
    res.json(article);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewArticlesController = async (req, res) => {
  try {
    const articles = await getAllArticles();
    res.json(articles);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

const viewArticleByIdController = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await getArticleById(articleId);
    res.json(article);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

module.exports = {
  createArticleController,
  editArticleController,
  deleteArticleController,
  viewArticlesController,
  viewArticleByIdController,
};
