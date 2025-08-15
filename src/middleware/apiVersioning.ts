import { Router } from "express";

export const urlVersioning = (version: string, router: Router) => {
  const prefixedRouter = Router();

  // Middleware to reject unsupported versions
  prefixedRouter.use((req, res, next) => {
    const requestedVersion = req.path.split("/")[1]; // e.g. "v2" from "/v2/supported"
    if (requestedVersion !== version) {
      return res.status(404).json({
        success: false,
        error: `API version '${requestedVersion}' is not supported. Supported version: '${version}'`,
      });
    }
    next();
  });

  // Mount routes
  prefixedRouter.use(`/${version}`, router);

  return prefixedRouter;
};
