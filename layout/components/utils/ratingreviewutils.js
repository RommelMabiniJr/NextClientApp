export const getTotalAverageRating = (worker) => {
  let total = 0;
  let count = 0;

  worker.reviews.forEach((review) => {
    total += review.rating;
    count++;
  });

  // Check if count is zero to avoid division by zero
  if (count === 0) {
    // Return a default value (e.g., 0) or handle it based on your requirements
    return 0;
  }

  return total / count;
};

export const getNumReviews = (worker) => {
  return worker.reviews.length;
};
