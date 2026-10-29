import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Адрес панели после «npx sanity deploy»: https://<studioHost>.sanity.studio
  studioHost: process.env.SANITY_STUDIO_HOST || undefined,
  // Идентификатор уже опубликованной панели (maksimar.sanity.studio), чтобы повторная публикация шла без вопросов
  deployment: { appId: "j43ptnie3n8xm6y17m081m0s" },
});
