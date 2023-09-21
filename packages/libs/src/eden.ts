import { type App } from "@nutrishare/backend";
import { edenTreaty } from "@elysiajs/eden";

export const treaty = edenTreaty<App>("http://127.0.0.1:8080");
