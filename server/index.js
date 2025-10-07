import { join } from "path";

import express from "express";
import { json } from "body-parser";

import authRoutes from "./auth";

const app = express();
app.use(json());
app.use(express.static(join(__dirname, "../public")));

app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
