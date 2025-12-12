import React from "react";

import { Card } from "@components";

import { useAuthContext } from "@contexts/Auth/context";

import formatDate from "@utils/formatDate";

function Dashboard() {
  const { user } = useAuthContext();

  return (
    <div className="grid grid-cols-2">
      <Card className="col-span-2">
        <h2 className="text-2xl font-semibold">
          Good Morning! {user.username}
        </h2>
        <p className="text-gray-500">{formatDate()}</p>

        <div class="stats stats-vertical md:stats-horizontal pt-5 text-center">
          <div class="stat">
            <div class="stat-title">Total Posts</div>
            <div class="stat-value">31K</div>
          </div>

          <div class="stat">
            <div class="stat-title">Pending Tasks</div>
            <div class="stat-value">4,200</div>
          </div>

          <div class="stat">
            <div class="stat-title">In Progress</div>
            <div class="stat-value">1,200</div>
          </div>

          <div class="stat">
            <div class="stat-title">Completed Tasks</div>
            <div class="stat-value">1,200</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
