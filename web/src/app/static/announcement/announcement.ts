import categories from "./category.json"; // Assuming categories.json is in the same directory
export const announcementFields = [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "Title",
  },
  {
    name: "description",
    label: "Description",
    type: "text",
    placeholder: "Description",
  },
  {
    name: "date_posted",
    label: "Date Posted",
    type: "date",
    placeholder: "Date Posted",
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "Location",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: categories,
    placeholder: "Category",
  },
  {
    name: "image_url",
    label: "Image URL",
    type: "text",
    placeholder: "Image URL",
  },
];
