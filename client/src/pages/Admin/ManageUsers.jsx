import { useState, useEffect } from "react";
import { DownloadButton, Card, Image, Loader, ErrorState } from "@components";

import { useFetchContext } from "@contexts/Fetch/context";

import useAxios from "@hooks/useAxios";

function ManageUsers() {
  const [members, setMembers] = useState([]);

  const { get } = useAxios(true);

  const { isLoading, isError, hasFetched, errorMsg, fetchDispatch } =
    useFetchContext();

  const getAllMembers = async () => {
    try {
      fetchDispatch({ type: "START_FETCHING" });
      const { data } = await get({ api: "/users" });

      setMembers(data);
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
    getAllMembers();
  }, []);

  return (
    <>
      <nav className="bg-base-200 px-5 py-4 rounded-box flex-between">
        <h2 className="text-xl font-semibold">All Members</h2>

        <DownloadButton api="users" />
      </nav>

      {isLoading && <Loader className="loader-task" />}

      {isError && (
        <ErrorState
          title="Something Went Wrong"
          desc={errorMsg}
          onRetry={async () => await getAllMembers()}
        />
      )}

      {hasFetched && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
          {members.map(
            ({
              _id,
              profileImageUrl,
              username,
              email,
              completedCount,
              pendingCount,
              inProgressCount,
            }) => (
              <Card className="shadow-lg" key={_id}>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <Image img={profileImageUrl} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className={`text-sm text-neutral font-semibold`}>
                      {username}
                    </h4>
                    <p className={`text-xs text-neutral`}>{email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col p-3 text-primary text-xs font-bold bg-base-300 rounded-box">
                    <span>{pendingCount}</span>
                    <span>Pending</span>
                  </div>

                  <div className="flex flex-col p-3 text-accent text-xs font-bold bg-base-300 rounded-box">
                    <span>{inProgressCount}</span>
                    <span className="whitespace-nowrap">In Progress</span>
                  </div>

                  <div className="flex flex-col p-3 text-success text-xs font-bold bg-base-300 rounded-box">
                    <span>{completedCount}</span>
                    <span>Completed</span>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>
      )}
    </>
  );
}

export default ManageUsers;
