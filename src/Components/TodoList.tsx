import type { ITodo } from "../Intetface";
import Button from "./UI/Button";
import useAuthanticatedQuery from "../hooks/useAuthanticatedQuery";
import Modal from "./UI/Modal";
import Input from "./UI/Input";
import { useState, type ChangeEvent, type FormEvent } from "react";
import Textarea from "./UI/TextArea";
import axiosInstance from "../Config/axios.config";
import TodoSkeleton from "./TodoSkeleton";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;
const TodoList = () => {
  //States
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [queryVersion, setqueryVersion] = useState(1);

  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
    documentId: "",
  });
  const [todoToAdd, setTodoToAdd] = useState({
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
  const openConfirmModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpenConfirmModal(true);
  };
  const closeConfirmModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
      documentId: "",
    });
    setIsOpenConfirmModal(false);
  };
  const openAddModal = () => {
    setIsOpenAddModal(true);
  };
  const closeAddModal = () => {
    setTodoToAdd({
      title: "",
      description: "",
      documentId: "",
    });
    setIsOpenAddModal(false);
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
  const onChangeAddHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
  };
  const onRemove = async () => {
    const { documentId } = todoToEdit;

    try {
      const { status } = await axiosInstance.delete(`/todos/${documentId}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });
      console.log(status);
      if (status === 204) {
        closeConfirmModal();
        setqueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
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
        setqueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
  const onSubmitAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { title, description } = todoToAdd;
    try {
      const { status } = await axiosInstance.post(
        `/todos`,
        { data: { title, description, user: [userData.user.id] } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      console.log(status);
      if (status === 201) {
        closeAddModal();
        setqueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const { isLoading, data } = useAuthanticatedQuery({
    queryKey: ["todoList", `${queryVersion}`],
    url: "/users/me?populate[todos][filters][publishedAt][$notNull]=true",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  if (isLoading)
    return (
      <div className="space-y-1">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );
  return (
    <div className="space-y-3">
      <div className=" mx-auto my-10">
        {isLoading ? (
          <div className="flex items-center gap-5  ">
            <div className=" h-9  bg-gray-300 rounded-md dark:bg-gray-700 w-full"></div>
            <div className=" h-9  bg-gray-300 rounded-md dark:bg-gray-700 w-full"></div>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <Button variant={"default"} fullWidth onClick={openAddModal}>
              Post new ToDo
            </Button>
            <Button variant={"outline"} fullWidth onClick={() => {}}>
              Generate ToDos
            </Button>
          </div>
        )}
      </div>
      {data.length ? (
        data.map((todo: ITodo) => {
          return (
            <div
              key={todo.id}
              className="flex items-center justify-between hover:bg-zinc-700 duration-300 p-3 rounded-md "
            >
              <p className="w-full font-semibold">
                {" "}
                {todo.id} - {todo.title}
              </p>
              <div className="flex items-center justify-end w-full space-x-3">
                <Button
                  variant={"default"}
                  size={"sm"}
                  onClick={() => onOpenModel(todo)}
                >
                  Edit
                </Button>
                <Button
                  variant={"danger"}
                  size={"sm"}
                  onClick={() => openConfirmModal(todo)}
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <h3>No Todos yet</h3>
      )}
      {/* Edit Todo modal */}

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
            <Button
              fullWidth
              variant={"cancel"}
              type="button"
              onClick={onCloseEditModel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* Delete Todo confirm modal */}
      <Modal
        isOpen={isOpenConfirmModal}
        isClosed={closeConfirmModal}
        title="Are you sure you want to remove this Todo from your Store?"
        description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center spave-x-3 gap-2">
          <Button variant={"danger"} fullWidth onClick={onRemove}>
            Yes , remove
          </Button>
          <Button
            fullWidth
            variant={"cancel"}
            type="button"
            onClick={closeConfirmModal}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      {/* Add Todo modal */}

      <Modal
        isClosed={closeAddModal}
        isOpen={isOpenAddModal}
        title="Add New Todo"
      >
        <form onSubmit={onSubmitAddTodo} className="space-y-3">
          <Input
            name="title"
            value={todoToAdd.title}
            onChange={onChangeAddHandler}
          />
          <Textarea
            name="description"
            value={todoToAdd.description}
            onChange={onChangeAddHandler}
          />
          <div className="flex justify-between  text-sm gap-2">
            <Button isLoading={isUpdating} fullWidth>
              {" "}
              Done
            </Button>
            <Button
              fullWidth
              variant={"cancel"}
              type="button"
              onClick={closeAddModal}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TodoList;
