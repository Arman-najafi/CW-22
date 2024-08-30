import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import { TodoFormType, todoSchema } from "./schema/todoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { instance } from "./utility/instance";
import List from "./component/list";

function App() {
  const form = useForm<TodoFormType>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      deadLine: "",
      title: "",
    },
  });
  const { mutate } = useMutation({
    mutationFn: async (data: TodoFormType) =>
      await instance.post("/todos", data),
  });
  const onSubmit: SubmitHandler<TodoFormType> = (value) => {
    mutate(value);
  };
  return (
    <div className="flex items-center justify-center h-screen p-5 bg-slate-800 flex-col gap-5">
      <form
        className="w-2/3 flex flex-col p-6 gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-white">TO DO APP</h1>
        <Controller
          control={form.control}
          name="title"
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="rounded-xl h-12 gap-8 p-4"
              placeholder="title"
            />
          )}
        />

        <Controller
          control={form.control}
          name="deadLine"
          render={({ field }) => {
            return (
              <DatePicker
                value={field.value || ""}
                onChange={(date) => {
                  field.onChange(
                    date?.isValid
                      ? new Date(date.unix * 1000).toISOString()
                      : ""
                  );
                }}
                render={
                  <input
                    className="rounded-xl h-12 gap-8 p-4"
                    placeholder="dead line"
                  />
                }
                calendar={persian}
                locale={persian_fa}
              />
            );
          }}
        />

        <button
          className="text-white bg-emerald-500 rounded-2xl w-48 h-10 "
          type="submit"
        >
          add task
        </button>
      </form>
      <List/>
    </div>
  );
}

export default App;
