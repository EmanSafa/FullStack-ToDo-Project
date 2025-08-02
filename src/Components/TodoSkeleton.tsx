const TodoSkeleton = () => {
  return (
    <div role="status" className=" p-4  rounded-sm shadow-sm animate-pulse">
      <div className="flex items-center justify-between ">
        <div>
          <div className="w-50 h-3 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        </div>
        <div className="flex items-center space-x-2 ">
          <div className=" h-9 w-20 bg-gray-300 rounded-md dark:bg-gray-700 "></div>
          <div className=" h-9 w-20 bg-gray-300 rounded-md dark:bg-gray-700 "></div>
        </div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default TodoSkeleton;
