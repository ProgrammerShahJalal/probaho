import React from "react";

const ManualEnrollmentNotice = () => {
  return (
    <div
      style={{
        padding: "16px",
        fontSize: "14px",
        lineHeight: "1.6",
        maxWidth: "500px",
      }}
    >
      <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>💡 Note to Admin:</h3>
      <p style={{ margin: 0 }}>For successful manual enrollment:</p>
      <ul style={{ paddingLeft: "18px", margin: "8px 0" }}>
        <li>➤ First, ensure the user exists in the system.</li>
        <li>➤ Then, confirm payment is made.</li>
        <li>➤ Finally, proceed with event enrollment.</li>
      </ul>
    </div>
  );
};

export default ManualEnrollmentNotice;
