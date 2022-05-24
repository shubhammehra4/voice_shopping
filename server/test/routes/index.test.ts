import { test } from "tap";
import { build } from "../helper";

test("default root route", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/",
  });
  t.same(JSON.parse(res.payload), { message: "Shopping Service is running" });
});

test("health check route", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/health",
  });
  t.same(JSON.parse(res.payload), { state: "healthy" });
});
