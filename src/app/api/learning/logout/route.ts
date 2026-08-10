import {
  clearLearningLogin,
  getLearningIdentity,
} from "@/modules/learning/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await getLearningIdentity())) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (
    (origin && origin !== new URL(request.url).origin) ||
    (fetchSite && fetchSite !== "same-origin")
  ) {
    return Response.json({ error: "Cross-site logout was rejected." }, { status: 403 });
  }
  await clearLearningLogin();
  return Response.json({ authenticated: false });
}
