export default function Message({ message, currentUserId }) {
  const isMe = message.sender_id === currentUserId;
  return (
    <div style={{ textAlign: isMe ? "right" : "left", margin: "5px 0" }}>
      <span
        style={{
          display: "inline-block",
          padding: "8px 12px",
          borderRadius: "15px",
          backgroundColor: isMe ? "#3b82f6" : "#e5e7eb",
          color: isMe ? "#fff" : "#000",
          maxWidth: "70%",
          wordWrap: "break-word",
        }}
      >
        {message.body}
      </span>
    </div>
  );
}
