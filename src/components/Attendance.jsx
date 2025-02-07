import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database"; // Import 'set' here

const Attendance = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // User data (name, username)
  const [timeIn, setTimeIn] = useState(null); // Time in state
  const [timeOut, setTimeOut] = useState(null); // Time out state
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const auth = getAuth();
  const db = getDatabase();

  // Get current user's data
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login"); // Redirect if not logged in
    } else {
      // Retrieve user data from Firebase
      const userRef = ref(db, `users/${user.uid}`);
      
      // Fetch user profile
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val()); // Set the user data (name, username)
        } else {
          console.log("No user data found");
        }
      }).catch((error) => {
        console.error("Error retrieving user data:", error);
      });

      // Fetch user's attendance data
      const attendanceRef = ref(db, `Attendance/${user.uid}/${new Date().toISOString().split("T")[0]}`);
      get(attendanceRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setTimeIn(data.timeIn || null);
          setTimeOut(data.timeOut || null);
          if (userData) {
            setAttendanceMessage(`Welcome back, ${userData.name || 'User'}`);
          }
        } else {
          console.log("No attendance data for today.");
        }
      }).catch((error) => {
        console.error("Error retrieving attendance data:", error);
      });
    }
  }, [auth, navigate, db, userData]); // Fetch on every render and when userData is updated

  // Function to handle time-in
  const handleTimeIn = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setTimeIn(time);
    const user = auth.currentUser;

    if (user && userData) {
      const attendanceRef = ref(db, `Attendance/${user.uid}/${now.toISOString().split("T")[0]}`);
      set(attendanceRef, {
        name: userData.name,
        username: userData.username,
        timeIn: time,
        date: now.toISOString().split("T")[0],
      });
      setAttendanceMessage(`Welcome, ${userData.name}, Time In: ${time}`);
    }
  };

  // Function to handle time-out
  const handleTimeOut = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setTimeOut(time);

    const user = auth.currentUser;
    if (user && userData) {
      const attendanceRef = ref(db, `Attendance/${user.uid}/${now.toISOString().split("T")[0]}`);
      set(attendanceRef, {
        ...userData, // Retain other user data
        timeIn: timeIn, // Use the previously saved time-in value
        timeOut: time,
        date: now.toISOString().split("T")[0],
      });
      setAttendanceMessage(`Time Out: ${time}`);
    }
  };

  return (
    <div className="auth-form">
      {/* Ensure userData is loaded before displaying */}
      {userData ? (
        <>
          <h3>{attendanceMessage || `Welcome, ${userData.name}`}</h3>
          <h2>Attendance muna!</h2>

          <p className="time-status">
            Time In: <span className="time-in">{timeIn || "Not yet clocked in"}</span>
          </p>
          <p className="time-status">
            Time Out: <span className="time-out">{timeOut || "Not yet clocked out"}</span>
          </p>

          <div>
            <button onClick={handleTimeIn} disabled={timeIn}>Time In</button>
            <button onClick={handleTimeOut} disabled={!timeIn}>Time Out</button>
          </div>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Attendance;
