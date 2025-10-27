import axios from "../../../libs/axios";

const BASE = "/api/posts";

/**
 * Get all posts with filters and pagination
 */
export const getAllPosts = async (params = {}) => {
  const { authorId, keyword, fromDate, toDate, page = 0, size = 10 } = params;

  const { data } = await axios.get(BASE, {
    params: { authorId, keyword, fromDate, toDate, page, size },
  });

  return data;
};

/**
 * Get post by ID
 */
export const getPostById = async (id) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

/**
 * Create post with images
 */
export const createPost = async (post, images = []) => {
  const formData = new FormData();

  const postBlob = new Blob([JSON.stringify(post)], {
    type: "application/json",
  });
  formData.append("post", postBlob);

  if (images && images.length > 0) {
    images.forEach((file) => formData.append("images", file));
  }

  const { data } = await axios.post("/api/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

/**
 * Patch post with new images
 */
export const patchPostUnified = async (id, { post, newImages = [] }) => {
  const token = localStorage.getItem("cmv_token");
  const formData = new FormData();

  formData.append(
    "post",
    new Blob([JSON.stringify(post)], { type: "application/json" })
  );

  newImages.forEach((file) => formData.append("newImages", file));

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/posts/${id}`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return await response.json();
};

/**
 * Delete post by ID
 */
export const deletePost = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};
