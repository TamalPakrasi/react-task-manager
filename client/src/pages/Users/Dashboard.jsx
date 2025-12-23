import { useReducer, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import { ArrowRight } from "lucide-react";

import { Card, Loader, ErrorState } from "@components";

import { useAuthContext } from "@contexts/Auth/context";
import { useFetchContext } from "@contexts/Fetch/context";

import useAxios from "@hooks/useAxios";

import formatDate from "@utils/formatDate";
import getGreetings from "@utils/getGreetings";
import { getStatusClass, getPriorityClass } from "@utils/getTaskClasses";

import memberReducer, { memberInitState } from "@reducers/member.reducer";

import formatCreatedAt from "@utils/formateCreatedAt";

function Dashboard() {
  const { user } = useAuthContext();
  const { get } = useAxios(true);

  const [dashboardState, dashboardDispatch] = useReducer(
    memberReducer,
    memberInitState
  );

  const { isLoading, isError, errorMsg, hasFetched, fetchDispatch } =
    useFetchContext();

  const getUserDashboardData = async () => {
    fetchDispatch({ type: "START_FETCHING" });

    try {
      const { data } = await get({ api: "/dashboard/summary" });

      dashboardDispatch({ type: "SET_DATA", payload: { data } });
    } catch (error) {
      fetchDispatch({
        type: "SET_ERROR",
        payload: { error: error.message },
      });
    } finally {
      fetchDispatch({ type: "STOP_FETCHING" });
    }
  };

  useEffect(() => {
    getUserDashboardData();
  }, []);

  if (isLoading) return <Loader className="loader-main" />;

  if (isError)
    return (
      <ErrorState
        title="Something Went Wrong"
        desc={errorMsg}
        onRetry={async () => await getUserDashboardData()}
      />
    );

  if (hasFetched)
    return (
      <div className="flex flex-col gap-8 w-full">
        <Card>
          <h2 className="text-2xl font-semibold">
            Good {getGreetings()}! {user.username}
          </h2>
          <p className="text-gray-500">{formatDate()}</p>

          <div className="stats stats-vertical md:stats-horizontal pt-5 text-center">
            <div className="stat">
              <div className="stat-title">Total Posts</div>
              <div className="stat-value">{dashboardState.data.stats.all}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Pending Tasks</div>
              <div className="stat-value">
                {dashboardState.data.stats.Pending}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">In Progress</div>
              <div className="stat-value">
                {dashboardState.data.stats["In Progress"]}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Completed Tasks</div>
              <div className="stat-value">
                {dashboardState.data.stats.Completed}
              </div>
            </div>
          </div>
        </Card>

        {dashboardState.data.stats.all > 0 ? (
          <>
            <div className="flex flex-col gap-8 md:gap-4 md:flex-row max-w-full">
              <Card className="md:w-1/2">
                <h4 className="text-lg font-semibold">Task Distribution</h4>
                <div className="h-60 mt-4">
                  <Doughnut
                    data={{
                      labels: ["Pending", "In Progress", "Completed"],
                      datasets: [
                        {
                          label: "Task Distribution",
                          data: [
                            dashboardState.data.dist.Pending,
                            dashboardState.data.dist["In Progress"],
                            dashboardState.data.dist.Completed,
                          ],
                          backgroundColor: [
                            "#5c1d70cc",
                            "#0969b0cc",
                            "#22c55e",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                </div>
              </Card>

              <Card className="md:w-1/2">
                <h4 className="text-lg font-semibold">Task Priority Levels</h4>
                <div className="h-60 mt-4">
                  <Bar
                    data={{
                      labels: ["Low", "Medium", "High"],
                      datasets: [
                        {
                          label: "Priority",
                          data: [
                            dashboardState.data.priority.Low,
                            dashboardState.data.priority.Medium,
                            dashboardState.data.priority.High,
                          ],
                          backgroundColor: ["#22c55e", "#f59e0b", "#e11d48"],
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 10,
                          },
                          grid: {
                            display: false,
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </Card>
            </div>

            <Card className="relative">
              <h4 className="text-lg font-semibold">Recent Tasks</h4>

              <div className="overflow-x-auto mt-4">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Created On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardState.data.tasks.map((task) => (
                      <tr key={task._id}>
                        <td>{task.title}</td>
                        <td>
                          <div
                            className={`badge badge-outline ${getStatusClass(
                              task.status
                            )} badge-sm`}
                          >
                            {task.status}
                          </div>
                        </td>
                        <td>
                          <div
                            className={`badge badge-outline ${getPriorityClass(
                              task.priority
                            )} badge-sm`}
                          >
                            {task.priority}
                          </div>
                        </td>
                        <td>{formatCreatedAt(task.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Link
                to="/member/tasks"
                className="btn border border-gray-400 absolute top-4.5 right-3 focus:outline-0"
              >
                See All <ArrowRight />
              </Link>
            </Card>
          </>
        ) : (
          <p className="text-center col-span-2 text-xl font-semibold">
            No Task is Assigned
          </p>
        )}
      </div>
    );
}

export default Dashboard;
