import useAuthanticatedQuery from "../hooks/useAuthanticatedQuery";
import type { ITodo } from "../Intetface";
import Paginator from "./../Components/UI/Paginator";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const Todos = () => {
  const { isLoading, data } = useAuthanticatedQuery({
    queryKey: ["paginatedTodos"],
    url: "/todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  console.log(data);
  if (isLoading) return <h3>Loading..</h3>;
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
      <Paginator />
    </div>
  );
};

export default Todos;
