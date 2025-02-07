import React from "react";
import "../App"; // Add styles for the modal

const Modal = ({ user, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>User Details</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Contact Number:</strong> {user.contactNumber}</p>
        <p><strong>Job Position:</strong> {user.jobPosition}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
