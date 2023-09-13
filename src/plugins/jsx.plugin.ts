import Elysia, { Context } from "elysia";
import isReactElement from "../util/isReactElement";
import { renderToReadableStream } from "react-dom/server";
export default new Elysia().onAfterHandle(async ({ set }, response) => {
  if (isReactElement(response)) {
    return new Response(await renderToReadableStream(response), {
      ...set,
      headers: {
        ...set.headers,
        "Content-Type": "text/html",
      } as Context["set"]["headers"],
    });
  }
  return;
});
