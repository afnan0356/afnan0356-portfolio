import type { APIRoute } from "astro";
import { searchIndex } from "../lib/search-index";
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await searchIndex()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
