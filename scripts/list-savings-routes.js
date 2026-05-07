import router from "../routes/savings.routes.js";

const listRoutes = router.stack
  .filter((layer) => layer.route)
  .map((layer) => {
    const methods = Object.keys(layer.route.methods).join(",");
    return `${methods} ${layer.route.path}`;
  });

console.log(listRoutes.join("\n"));
