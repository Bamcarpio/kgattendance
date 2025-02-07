import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import Modal from "./Modal";


const Dashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Store the selected user for modal
  const auth = getAuth();
  const db = getDatabase();

  // Fetch all users' attendance data
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      // Redirect to login if the admin is not logged in
      window.location.href = "/login";
    }

    // Fetch attendance data for the selected date
    const attendanceRef = ref(db, `Attendance`);
    get(attendanceRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let attendanceArr = [];

        // Flatten the attendance data
        Object.keys(data).forEach((userId) => {
          const userAttendance = data[userId][selectedDate];
          if (userAttendance) {
            attendanceArr.push({
              userId,
              name: userAttendance.name,
              timeIn: userAttendance.timeIn,
              timeOut: userAttendance.timeOut,
              date: selectedDate,
            });
          }
        });

        // Sort by time in
        attendanceArr.sort((a, b) => (a.timeIn > b.timeIn ? 1 : -1));
        setAttendanceData(attendanceArr);
        setIsLoading(false);
      } else {
        setErrorMessage("No attendance data available for today.");
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error("Error fetching attendance data:", error);
      setErrorMessage("Failed to fetch data. Please try again.");
      setIsLoading(false);
    });
  }, [selectedDate, auth, db]); // Refetch data when the date is changed

  // Function to handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Function to open the modal and fetch user details
  const openUserDetails = (userId) => {
    const userRef = ref(db, `users/${userId}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setSelectedUser(snapshot.val());
      }
    });
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, Admin!</p>
      </div>
      
      <div className="dashboard-form">
        <label htmlFor="date-selector">Select Date: </label>
        <input
          type="date"
          id="date-selector"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <h2>Attendance for {selectedDate}</h2>

      {isLoading ? (
        <p>Loading attendance data...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Details</th> {/* Add a column for the "Details" button */}
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((attendance, index) => (
                  <tr key={index}>
                    <td>{attendance.name}</td>
                    <td>{attendance.timeIn}</td>
                    <td>{attendance.timeOut || "Not yet clocked out"}</td>
                    <td>
                        <button className="button-modal" onClick={() => openUserDetails(attendance.userId)}>User Info</button>
                    
  
                        

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No attendance data for this date</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Show the modal if a user is selected */}
      {selectedUser && <Modal user={selectedUser} onClose={closeModal} />}
    </div>
  );
};

export default Dashboard;
