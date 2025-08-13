import type { Request, Response, NextFunction } from "express";

export const urlVersioning =
  (version: string) => (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith(`/api/${version}`)) {
      next();
    } else {
      res.status(404).json({
        success: false,
        error: "Api version is not supported",
      });
    }
  };

export const headerVersion =
  (version: string) => (req: Request, res: Response, next: NextFunction) => {
    if (req.get("Accept-Version") === version) {
      next();
    } else {
      res.status(404).json({
        success: false,
        error: "Api version is not supported",
      });
    }
  };
