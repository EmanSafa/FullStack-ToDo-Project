import useAuthanticatedQuery from "../hooks/useAuthanticatedQuery";
import type { ITodo } from "../Intetface";
import Paginator from "../Components/Paginator";
import { useState, type ChangeEvent } from "react";
import Button from "./../Components/UI/Button";
import axiosInstance from "./../Config/axios.config";
import { faker } from "@faker-js/faker";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const Todos = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("DESC");
  const { isLoading, data } = useAuthanticatedQuery({
    queryKey: [`todoos-page-${page}`, `${pageSize}`, `${sortBy}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
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

  const onGenerateTodos = async () => {
    for (let i = 0; i < 10; i++) {
      try {
        const { data } = await axiosInstance.post(
          `/todos`,
          {
            data: {
              title: faker.word.words(3),
              description: faker.lorem.paragraph(2),
              user: [userData.user.id],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userData.jwt}`,
            },
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const onChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };
  const onChangesortBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  return (
    <div className="">
      <div className="flex items-center  justify-around ">
        <Button
          variant={"default"}
          title="generate 10 records"
          onClick={onGenerateTodos}
        >
          Generate 10 Todos
        </Button>
        <div className="space-x-5">
          <select
            className="border-2  botder-indego-600 rounded-md p-2 bg-zinc-800"
            value={sortBy}
            onChange={onChangesortBy}
          >
            <option>Sort By</option>
            <option value="ASC">Oldest</option>
            <option value="DESC">Latest</option>
          </select>
          <select
            className="border-2  botder-indego-600 rounded-md p-2  bg-zinc-800"
            value={pageSize}
            onChange={onChangePageSize}
          >
            <option disabled>Page Size</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="my-20 space-y-6">
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
    </div>
  );
};

export default Todos;
