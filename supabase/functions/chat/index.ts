import { withSupabase } from "npm:@supabase/server";
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";

const OPENAI_URL = "https://api.openai.com/v1/responses";
const MODEL = Deno.env.get("OPENAI_MODEL") || "gpt-5.6-luna";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
      const key = Deno.env.get("OPENAI_API_KEY");
      if (!key) return json({ error: "OPENAI_API_KEY is not configured in Supabase." }, 500);

      const body = await req.json();
      const messages = Array.isArray(body.messages)
        ? body.messages
            .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
            .slice(-20)
            .map((m: any) => ({ role: m.role, content: m.content.slice(0, 8000) }))
        : [];

      if (!messages.length) return json({ error: "No messages supplied." }, 400);

      const { data: memories, error: memoryError } = await ctx.supabase
        .from("memories")
        .select("content, created_at")
        .order("created_at", { ascending: false })
        .limit(30);

      if (memoryError) throw memoryError;

      const memoryText = (memories || []).length
        ? "\nRelevant long-term memory:\n" + memories.map((m: any) => "- " + m.content).join("\n")
        : "";

      const response = await fetch(OPENAI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + key
        },
        body: JSON.stringify({
          model: MODEL,
          store: false,
          input: [
            {
              role: "developer",
              content: "You are JARVIS, a calm and capable personal AI assistant. Be useful and concise. Never claim an external action happened unless the application confirms it. Ask before consequential actions." + memoryText
            },
            ...messages
          ],
          max_output_tokens: 700
        })
      });

      const data = await response.json();
      if (!response.ok) {
        return json({ error: data?.error?.message || "OpenAI request failed." }, response.status);
      }

      return json({ message: data.output_text || "I did not receive a text response." });
    } catch (e) {
      return json({ error: e instanceof Error ? e.message : "Unexpected server error." }, 500);
    }
  })
};
