import { type App } from "@nutrishare/backend";
import { edenTreaty } from "@elysiajs/eden";

export const treaty = edenTreaty<App>("http://localhost:8080");
