const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt);

  return date.toLocaleDateString(navigator.language, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default formatCreatedAt;
