import { Hono } from "hono";

const service = new Hono<{ Bindings: Bindings }>();

type Bindings = {
  courses: R2Bucket;
};

service.get("/all", async (c) => {
  const key = c.req.query("key") as string;
  const bucket = c.env.courses;
  const deleteArray = [];
  const list = await bucket.list({
    prefix: key,
  });

  for (const item of list.objects) {
    console.log(item);
    deleteArray.push(bucket.delete(item.key));
  }
  await Promise.all(deleteArray);
  return c.json(deleteArray);
});

service.get("/prefix/:prefix", async (c) => {
  const pre = c.req.param("prefix");
  const bucket = c.env.courses;
  const list = await bucket.list({
    prefix: pre,
  });
  const array = list.objects.map((item) => {
    return item.key;
  });
  const deleted = await bucket.delete(array);
  return c.json(deleted);
});

/* service.get("/mockdata", async (c) => {
  const bucket = c.env.courses;
  for (let i = 0; i < 10; i++) {
    console.log(i);
    await bucket.put(JSON.stringify(i), JSON.stringify(i));
  }
  return c.json("asd");
}); */

export default service;
