import type { ITodo } from "../Intetface";
import Button from "./UI/Button";
import useAuthanticatedQuery from "../hooks/useAuthanticatedQuery";
import Modal from "./UI/Modal";
import Input from "./UI/Input";
import { useState } from "react";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;
const TodoList = () => {
  //States
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  //Handlers
  const onToggleEditModel = () => {
    setIsEditModelOpen((prev) => !prev);
  };
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
                <Button
                  variant={"default"}
                  size={"sm"}
                  onClick={() => setIsEditModelOpen(true)}
                >
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
      <Modal
        isClosed={onToggleEditModel}
        isOpen={isEditModelOpen}
        title="Edit This Todo"
      >
        <Input />
        <div className="flex justify-between mt-3 text-sm gap-2">
          <Button className="" fullWidth>
            {" "}
            Update
          </Button>
          <Button fullWidth variant={"cancel"} onClick={onToggleEditModel}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
