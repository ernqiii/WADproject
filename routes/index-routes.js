const indexController = require("../controllers/index-controller");
const router = require("./login-routes");

router.get("/", indexController.showIndex);
