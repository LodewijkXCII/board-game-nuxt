import { z } from "zod";

export const NUMBER_AS_STRING = z.coerce.number().int({ message: "not a number" }).positive();

export const validId = z.object({
  id: NUMBER_AS_STRING,
});
