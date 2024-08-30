import { useQuery } from "@tanstack/react-query";
import { instance } from "../utility/instance";

export default function List() {
  const { data } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => (await instance("/todos")).data,
  });
  

  return <div>list</div>;
}
