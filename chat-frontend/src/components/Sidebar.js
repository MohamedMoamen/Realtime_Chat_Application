export default function Sidebar({ users, selectUser, selectedUser }) {
  return (
    <div style={{ width: "200px", borderRight: "1px solid #ccc", padding: "10px" }}>
      <h3>Users</h3>
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => selectUser(user)}
          style={{
            padding: "8px",
            margin: "5px 0",
            cursor: "pointer",
            backgroundColor: selectedUser?.id === user.id ? "#ddd" : "transparent",
          }}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}
