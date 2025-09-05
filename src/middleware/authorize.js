module.exports = function authorize({
  roles = [],
  allowOwner = false,
  loadResource,
}) {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).end();

    if (roles.includes(user.role)) return next();

    if (allowOwner && loadResource) {
      const resource = await loadResource(req);
      if (resource?.authorId === user.id) return next();
    }
    return res.status(403).json({ error: "Acesso negado" });
  };
};
