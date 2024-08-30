import { z } from "zod";

 export const todoSchema = z.object({
    title:z.string().min(1,"its required"),
    deadLine:z.string().min(1,"its required")
})
 export type TodoFormType = z.infer<typeof todoSchema>