import type { ITodo } from "../Intetface";
import Button from "./UI/Button";
import useAuthanticatedQuery from "../hooks/useAuthanticatedQuery";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const TodoList = () => {
  const { isLoading, data } = useAuthanticatedQuery({
    queryKey: ["Todos"],
    url: "/users/me?populate[todos][filters][publishedAt][$notNull]=true",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  if (isLoading) return <h3>Loading ...</h3>;
  return (
    <div className="space-y-3">
      {data.length ? (
        data.map((todo: ITodo) => {
          return (
            <div
              key={todo.id}
              className="flex items-center justify-between hover:bg-zinc-700 duration-300 p-3 rounded-md "
            >
              <p className="w-full font-semibold"> {todo.title}</p>
              <div className="flex items-center justify-end w-full space-x-3">
                <Button variant={"default"} size={"sm"}>
                  Edit
                </Button>
                <Button variant={"danger"} size={"sm"}>
                  Remove
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <h3>No Todos yet</h3>
      )}
    </div>
  );
};

export default TodoList;
