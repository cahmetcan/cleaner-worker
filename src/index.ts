import { Hono } from "hono";
import service from "./service";

const app = new Hono();

app.route("/", service);

export default app;
