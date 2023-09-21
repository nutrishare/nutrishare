import swagger from "@elysiajs/swagger";

const version: string =
  (await Bun.file("package.json").json()).version ?? "unknown";

export default swagger({
  documentation: {
    info: { title: "NutriShare API", version },
  },
});
