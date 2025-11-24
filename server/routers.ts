import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { workflowRouter } from "./routers/workflow";
import { mandatRouter } from "./routers/mandat";
import { appointmentRouter } from "./routers/appointment";
import { uploadRouter } from "./routers/upload";
import { parrainageRouter } from "./routers/parrainage";
import { contactRouter } from "./routers/contact";
import { ocrRouter } from "./routers/ocr";
import { airtableRouter } from "./routers/airtable";
import { clientRouter } from "./routers/client";
import { contractRouter } from "./routers/contract";
// import { stripeWebhookRouter } from "./routers/stripe-webhook"; // Non utilisé - webhook géré par Express directement

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  workflow: workflowRouter,
  mandat: mandatRouter,
  appointment: appointmentRouter,
  upload: uploadRouter,
  parrainage: parrainageRouter,
  contact: contactRouter,
  ocr: ocrRouter,
  airtable: airtableRouter,
  client: clientRouter,
  contract: contractRouter,
  // stripeWebhook: stripeWebhookRouter, // Non utilisé - webhook géré par Express directement
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
