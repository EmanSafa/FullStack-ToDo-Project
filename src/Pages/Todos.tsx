import useAuthanticatedQuery from "../hooks/useAuthanticatedQuery";
import type { ITodo } from "../Intetface";
import Paginator from "../Components/Paginator";
import { useState } from "react";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const Todos = () => {
  const [page, setPage] = useState<number>(1);
  const { isLoading, data } = useAuthanticatedQuery({
    queryKey: [`todoos-page-${page}`],
    url: `/todos?pagination[pageSize]=50&pagination[page]=${page}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  console.log(data);
  if (isLoading) return <h3>Loading..</h3>;
  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };
  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };
  return (
    <div className="my-16 space-y-6">
      {data.data.length ? (
        data.data.map(({ id, title }: ITodo) => {
          return (
            <div
              key={id}
              className="flex items-center justify-between hover:bg-zinc-700 duration-300 p-3 rounded-md "
            >
              <p className="w-full font-semibold">
                {" "}
                {id} - {title}
              </p>
            </div>
          );
        })
      ) : (
        <h3>No Todos yet</h3>
      )}
      <Paginator
        page={page}
        pageCount={data.meta.pagination.pageCount}
        onClickNext={onClickNext}
        onClickPrev={onClickPrev}
        total={data.meta.pagination.total}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Todos;
