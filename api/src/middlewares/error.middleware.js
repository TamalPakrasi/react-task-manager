const error = (err, req, res) => {
  return res?.sendJSON({ message: "Failed" }, 500);
};

export default error;
