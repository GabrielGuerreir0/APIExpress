module.exports = function authorize({
  roles = [],
  allowOwner = false,
  loadResource,
}) {
  return async (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    let authorized = false;

    if (roles.includes(user.role)) {
      authorized = true;
    }

    if (!authorized && allowOwner && loadResource) {
      try {
        const resource = await loadResource(req);
        if (resource?.authorId === user.id) {
          authorized = true;
        }
      } catch (err) {
        console.error("Erro ao carregar recurso para autorização:", err);
        return res.status(500).json({ error: "Erro no servidor" });
      }
    }

    if (authorized) {
      return next();
    }

    return res.status(403).json({ error: "Acesso negado" });
  };
};
