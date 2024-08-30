import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { client } from "../main";
import { instance } from "../utility/instance";
import EditButton from "./EditButton";
import { useFormContext } from "react-hook-form";
import { TodoFormType } from "../schema/todoSchema";

export default function List() {
  //** get data */
  const { data } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => (await instance("/todos")).data,
  });
  //** delete */
  const { mutate } = useMutation({
    mutationFn: async (id: number) => await instance.delete("/todos/" + id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["todos"],
      });
      toast("deleted successfully", { type: "success" });
    },
  });
  //** form */

  const form = useFormContext<TodoFormType>();
  //** handle Edit */

  const handleEdit = function (todo: Todo) {
    form.reset({ ...todo });
  };
  return (
    <div className="flex flex-col gap-4 w-2/3">
      {data?.map((todo) => (
        <div
          key={todo.id}
          className="flex justify-around p-3 items-center text-white bg-cyan-500 rounded-md"
        >
          <p className="font-bold text-lg">{todo.title}</p>
          <p className="font-bold text-lg">{todo.number}</p>
          <p className="font-bold text-lg">
            {new Date(todo.deadLine).toLocaleDateString("fa-IR")}
          </p>
          <button
            onClick={() => mutate(todo.id)}
            type="button"
            className="px-6 py-3 bg-red-500 text-white rounded-md shadow-md"
          >
            delete
          </button>
          <EditButton onClick={() => handleEdit(todo)}>edit</EditButton>
        </div>
      ))}
    </div>
  );
}
