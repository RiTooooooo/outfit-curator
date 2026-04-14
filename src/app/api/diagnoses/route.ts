import { diagnosisService } from "server/service/diagnosisService";
import { createRoute } from "./frourio.server";

export const { POST } = createRoute({
  post: async ({ body }) => {
    const result = await diagnosisService(body.choiceIds, body.sessionId);

    return { status: 200, body: result };
  },
});
