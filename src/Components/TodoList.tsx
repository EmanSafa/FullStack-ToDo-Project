import type { ITodo } from "../Intetface";
import Button from "./UI/Button";
import useAuthanticatedQuery from "../hooks/useAuthanticatedQuery";
import Modal from "./UI/Modal";
import Input from "./UI/Input";
import { useState, type ChangeEvent, type FormEvent } from "react";
import Textarea from "./UI/TextArea";
import axiosInstance from "../Config/axios.config";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;
const TodoList = () => {
  //States
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
    documentId: "",
  });
  //Handlers
  const onCloseEditModel = () => {
    setTodoToEdit({ id: 0, title: "", description: "", documentId: "" });
    setIsEditModelOpen(false);
  };
  const onOpenModel = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsEditModelOpen(true);
  };
  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { title, description, documentId } = todoToEdit;
    try {
      const { status } = await axiosInstance.put(
        `/todos/${documentId}`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      console.log(status);
      if (status === 200) {
        onCloseEditModel();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
  const { isLoading, data } = useAuthanticatedQuery({
    queryKey: ["todoList", `${todoToEdit.id}`],
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
                  onClick={() => onOpenModel(todo)}
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
        isClosed={onCloseEditModel}
        isOpen={isEditModelOpen}
        title="Edit This Todo"
      >
        <form onSubmit={onSubmitHandler} className="space-y-3">
          <Input
            name="title"
            value={todoToEdit.title}
            onChange={onChangeHandler}
          />
          <Textarea
            name="description"
            value={todoToEdit.description}
            onChange={onChangeHandler}
          />
          <div className="flex justify-between  text-sm gap-2">
            <Button isLoading={isUpdating} fullWidth>
              {" "}
              Update
            </Button>
            <Button fullWidth variant={"cancel"} onClick={onCloseEditModel}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TodoList;
