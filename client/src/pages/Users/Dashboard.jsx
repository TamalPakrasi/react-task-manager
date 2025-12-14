import React from "react";
import { Link } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import { ArrowRight } from "lucide-react";

import { Card } from "@components";

import { useAuthContext } from "@contexts/Auth/context";

import formatDate from "@utils/formatDate";

function Dashboard() {
  const { user } = useAuthContext();

  const taskDist = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Task Distribution",
        data: [33, 33, 34],
        backgroundColor: ["#5c1d70cc", "#0969b0cc", "#22c55e"],
        borderWidth: 1,
      },
    ],
  };

  const taskPrio = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Priority",
        data: [12, 19, 3, 5, 2, 8],
        backgroundColor: ["#22c55e", "#f59e0b", "#e11d48"],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="md:col-span-2">
        <h2 className="text-2xl font-semibold">
          Good Morning! {user.username}
        </h2>
        <p className="text-gray-500">{formatDate()}</p>

        <div className="stats stats-vertical md:stats-horizontal pt-5 text-center">
          <div className="stat">
            <div className="stat-title">Total Posts</div>
            <div className="stat-value">31K</div>
          </div>

          <div className="stat">
            <div className="stat-title">Pending Tasks</div>
            <div className="stat-value">4,200</div>
          </div>

          <div className="stat">
            <div className="stat-title">In Progress</div>
            <div className="stat-value">1,200</div>
          </div>

          <div className="stat">
            <div className="stat-title">Completed Tasks</div>
            <div className="stat-value">1,200</div>
          </div>
        </div>
      </Card>

      <Card>
        <h4 className="text-lg font-semibold">Task Distribution</h4>
        <div className="h-60 mt-4">
          <Doughnut data={taskDist} />
        </div>
      </Card>

      <Card>
        <h4 className="text-lg font-semibold">Task Priority Levels</h4>
        <div className="h-60 mt-4">
          <Bar
            data={taskPrio}
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

      <Card className="md:col-span-2 relative">
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
              <tr>
                <td>Cy Ganderton</td>
                <td>
                  <div className="badge badge-outline text-[#5c1d70cc] badge-sm">
                    Pending
                  </div>
                </td>
                <td>
                  <div className="badge badge-outline text-green-600 badge-sm">
                    Low
                  </div>
                </td>
                <td>12 September, 2025</td>
              </tr>

              <tr>
                <td>Hart Hagerty</td>
                <td>
                  <div className="badge badge-outline text-[#0969b0cc] badge-sm">
                    In Progress
                  </div>
                </td>
                <td>
                  <div className="badge badge-outline text-[#f59e0b] badge-sm">
                    Medium
                  </div>
                </td>
                <td>12 September, 2025</td>
              </tr>

              <tr>
                <td>Brice Swyre</td>
                <td>
                  <div className="badge badge-outline text-green-600 badge-sm">
                    Completed
                  </div>
                </td>
                <td>
                  <div className="badge badge-outline text-[#e11d48] badge-sm">
                    High
                  </div>
                </td>
                <td>12 June, 2025</td>
              </tr>
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
    </div>
  );
}

export default Dashboard;
