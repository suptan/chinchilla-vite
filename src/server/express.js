import express from "express";
// import { hotReloadMiddleware } from "@devmade/express-hot-reload";

const app = express();
const router = express.Router();

// Add the middleware to your Express app
// app.use(hotReloadMiddleware());
// OR passing options like..
// app.use(hotReloadMiddleware({ watchFolders: ["."] }));
// it accpets multiple folders optionally or if none is passed it will defaults to `.src`

router.use("/health", function (req, res) {
  console.log("method", req.method);

  res.send({ status: "success", data: "Alive" });
});

app.use("/api/:version/", router);

app.listen(9001, () => {
  console.log("Server running on http://localhost:9001");
});
