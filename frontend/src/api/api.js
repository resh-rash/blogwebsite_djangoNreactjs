import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';  // Update this in production

export const fetchBlogs = () => axios.get(`${API_BASE_URL}/blogs/`);
export const fetchBlogDetail = (slug) => axios.get(`${API_BASE_URL}/blog/${slug}/`);
export const fetchCategories = () => axios.get(`${API_BASE_URL}/blogs/categories/`);