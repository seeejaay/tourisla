export const articleFields = [
  { name: "title", label: "Title", type: "text", placeholder: "Enter article title" },
  { name: "author", label: "Author", type: "text", placeholder: "Author's name" },
  { name: "published_date", label: "Published Date", type: "date" },
  { name: "published_at", label: "Published Time", type: "time" },
  { name: "body", label: "Body", type: "textarea", placeholder: "Write the full article..." },
  { name: "video_url", label: "Video URL", type: "text", placeholder: "https://..." },
  { name: "thumbnail_url", label: "Thumbnail Image URL", type: "text", placeholder: "https://..." },
  { name: "tags", label: "Tags", type: "text", placeholder: "Comma-separated tags" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "PUBLISHED", label: "Published" },
      { value: "DRAFT", label: "Draft" },
    ],
  },
  { name: "is_featured", label: "Featured?", type: "checkbox" },
];
