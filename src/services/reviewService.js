import api from './api';

const reviewService = {
  // Get reviews for product
  getReviewsByProduct: async (productId, page = 0, size = 20) => {
    const response = await api.get(
      `/api/products/${productId}/reviews?page=${page}&size=${size}`
    );
    return response.data;
  },

  // Add review
  addReview: async (productId, reviewData) => {
    const response = await api.post(
      `/api/products/${productId}/reviews`,
      reviewData
    );
    return response.data;
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/api/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId) => {
    await api.delete(`/api/reviews/${reviewId}`);
  },
};

export default reviewService;
