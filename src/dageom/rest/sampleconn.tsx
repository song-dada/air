import React, { useEffect, useState } from "react";

function UserList() {
//   const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [datas, setData] = useState<any[]>([]);

  useEffect(() => {
    // REST API 호출
    fetch("http://localhost:4000/sample")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
      console.log(setData);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }


  return (
    <div>
      <h1>User List</h1>
      <ul>
        {datas.map((data) => (
        //   <li key={user.id}>{user.name}</li>
            // console.log(data);
          <li key={data.stationName}>{data.stationName}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
