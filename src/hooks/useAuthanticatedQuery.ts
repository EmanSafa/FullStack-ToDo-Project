import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../Config/axios.config";
import type { AxiosRequestConfig } from "axios";

interface IAuthanticatedQuery {
  queryKey: string[];
  url: string;
  config?: AxiosRequestConfig;
}
const useAuthanticatedQuery = ({
  queryKey,
  url,
  config,
}: IAuthanticatedQuery) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get(url, config);
      return data.todos;
    },
  });
};
export default useAuthanticatedQuery;
