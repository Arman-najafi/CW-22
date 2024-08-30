import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "title is required"),
  deadLine: z.string().min(1, "deadline is required"),
  number: z.number({ message: "number is required" }),
  id: z.number().optional(),
});
export type TodoFormType = z.infer<typeof todoSchema>;
