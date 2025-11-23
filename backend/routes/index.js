import userProgressRoutes from "./userProgressRoutes.js";
import courseRoutes from "./courseRoutes.js";

export default function (app) {
  app.use("/api/progress", userProgressRoutes);
  app.use("/api/courses", courseRoutes);
}
