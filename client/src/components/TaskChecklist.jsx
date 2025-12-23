import { useParams } from "react-router-dom";

import useAxios from "@hooks/useAxios";

function TaskChecklist({ taskList = [], setTaskList }) {
  const { id } = useParams();

  const { put } = useAxios(true);

  const updateTaskCheckList = async (newTaskList = []) => {
    try {
      const { data } = await put({
        api: `/tasks/task?id=${id}`,
        data: { taskCheckList: newTaskList },
      });

      setTaskList(data.taskCheckList, data.status);
    } catch (error) {}
  };

  const handleChange = async (oldText) => {
    const newTaskList = taskList.map((task) =>
      task.text === oldText ? { ...task, completed: !task.completed } : task
    );

    await updateTaskCheckList(newTaskList);
  };

  return (
    <ul className="mt-0.5 list">
      {taskList.map(({ text, completed }) => (
        <li className="list-row px-0" key={text}>
          <input
            type="checkbox"
            id="wireframe1"
            className="checkbox size-5"
            checked={completed}
            onChange={async () => await handleChange(text)}
          />
          <label htmlFor="wireframe1" className="font-semibold">
            {text}
          </label>
        </li>
      ))}
    </ul>
  );
}

export default TaskChecklist;
