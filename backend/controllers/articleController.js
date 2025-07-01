const {
  createArticle,
  editArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  addArticleImages,
  getArticleImages,
  deleteArticleImage,
} = require("../models/articleModel.js");

const { s3Client, PutObjectCommand, deleteS3Object } = require("../utils/s3.js");

const createArticleController = async (req, res) => {
  try {
    let {
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
    } = req.body;

    title = title?.toUpperCase();
    author = author?.toUpperCase();
    content = content?.toUpperCase();
    type = type?.toUpperCase();
    barangay = barangay?.toUpperCase();

    const article = await createArticle({
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
    });

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files.slice(0, 5)) {
        const s3Key = `article_images/${Date.now()}_${file.originalname}`;
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        imageUrls.push(imageUrl);
      }
      await addArticleImages(article.id, imageUrls);
    }

    res.status(201).json({
      ...article,
      images: imageUrls,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const editArticleController = async (req, res) => {
  try {
    const { articleId } = req.params;
    let {
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
    } = req.body;

    title = title?.toUpperCase();
    author = author?.toUpperCase();
    content = content?.toUpperCase();
    type = type?.toUpperCase();
    barangay = barangay?.toUpperCase();

    const updated = await editArticle(articleId, {
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
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const deleteArticleController = async (req, res) => {
  try {
    const { articleId } = req.params;
    const result = await deleteArticle(articleId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const viewArticlesController = async (req, res) => {
  try {
    const articles = await getAllArticles();
    const fullArticles = await Promise.all(
      articles.map(async (article) => {
        const images = await getArticleImages(article.id);
        return { ...article, images };
      })
    );
    res.json(fullArticles);
  } catch (err) {
    console.error(err);
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
    const images = await getArticleImages(articleId);
    res.json({ ...article, images });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const uploadArticleImagesController = async (req, res) => {
  try {
    const { articleId } = req.params;
    let imageUrls = [];

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    for (const file of req.files.slice(0, 5)) {
      const s3Key = `article_images/${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
      imageUrls.push(imageUrl);
    }

    const savedImages = await addArticleImages(articleId, imageUrls);
    res.status(201).json(savedImages);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const deleteArticleImageController = async (req, res) => {
  try {
    const { imageId } = req.params;
    const deletedImage = await deleteArticleImage(imageId);

    if (!deletedImage) {
      return res.status(404).json({ message: "Image not found." });
    }

    const imageUrl = deletedImage.image_url;
    const url = new URL(imageUrl);
    const s3Key = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;

    try {
      await deleteS3Object(s3Key);
    } catch (s3Error) {
      console.error("S3 Deletion Error:", s3Error.message);
    }

    res.status(200).json({
      message: "Image deleted successfully.",
      deletedImage,
    });
  } catch (err) {
    console.error("Image deletion failed:", err);
    res.status(500).json({ error: "Failed to delete image." });
  }
};

module.exports = {
  createArticleController,
  editArticleController,
  deleteArticleController,
  viewArticlesController,
  viewArticleByIdController,
  uploadArticleImagesController,
  deleteArticleImageController,
};
