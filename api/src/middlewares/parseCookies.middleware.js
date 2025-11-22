const parseCookies = (req, res, next) => {
  req.cookies = null;
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return next();
  }

  req.cookies = {};

  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    req.cookies[name] = value;
  });

  next();
};

export default parseCookies;
