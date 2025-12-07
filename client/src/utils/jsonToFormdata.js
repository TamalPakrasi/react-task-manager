const jsonToFormdata = (json) => {
  const formdata = new FormData();

  Object.entries(json).forEach(([key, { value }]) => {
    if (value === null || value === undefined) return;

    formdata.append(key, value);
  });

  return formdata;
};

export default jsonToFormdata;
