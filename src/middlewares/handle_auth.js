  const handleAuth = (role) => {
    return (req, res, next) => {
      if (!req.user) res.status(401).json({ message: "No User found" });
      if (req.user.role !== role)
        res.status(401).json({ message: "Unauthorized" });
      //si todo ok, pasa
      next();
    };
  };

  export default handleAuth;
