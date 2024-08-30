import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import { TodoFormType, todoSchema } from "./schema/todoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { instance } from "./utility/instance";
import List from "./components/list";
import { client } from "./main";
import { toast } from "react-toastify";

function App() {
  const form = useForm<TodoFormType>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      deadLine: "",
      title: "",
      number: undefined,
    },
  });
  console.log(form.watch());

  const { mutate: create } = useMutation({
    mutationFn: async (data: TodoFormType) =>
      await instance.post("/todos", data),

    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: ["todos"],
      });
      form.reset();
      toast(`${data.data.title} added successfully`, { type: "success" });
    },
  });
  const { mutate: update } = useMutation({
    mutationFn: async (data: TodoFormType) =>
      await instance.put(`/todos/${data.id}`, data),

    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: ["todos"],
      });
      form.reset({
        deadLine: "",
        id: undefined,
        title: "",
        number: undefined,
      });
      toast(`${data.data.title} edited successfully`, { type: "success" });
    },
  });
  const onSubmit: SubmitHandler<TodoFormType> = (value) => {
    if (value.id) {
      update(value);
    } else {
      create(value);
    }
  };
  return (
    <FormProvider {...form}>
      <div className="flex items-center justify-center h-screen p-5 bg-slate-800 flex-col gap-5">
        <form
          className="w-2/3 flex flex-col p-6 gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="text-white">TO DO APP</h1>
          <input
            className="rounded-xl h-12 gap-8 p-4"
            type="number"
            placeholder="number"
            {...form.register("number", { valueAsNumber: true })}
            value={form.getValues("number") || ""}
          />
          {form.formState.errors.number?.message && (
            <span className="text-red-500">
              {form.formState.errors.number?.message}
            </span>
          )}
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
          {form.formState.errors.title?.message && (
            <span className="text-red-500">
              {form.formState.errors.title?.message}
            </span>
          )}

          <Controller
            control={form.control}
            name="deadLine"
            render={({
              field,
              formState: {
                errors: { deadLine },
              },
            }) => {
              return (
                <>
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
                  {deadLine?.message && (
                    <span className="text-red-500">{deadLine?.message}</span>
                  )}
                </>
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
        <List />
      </div>
    </FormProvider>
  );
}

export default App;
