import userProgressRoutes from "./userProgressRoutes.js";
import courseRoutes from "./courseRoutes.js";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";

export default function (app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/progress", userProgressRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/admin", adminRoutes);
}
