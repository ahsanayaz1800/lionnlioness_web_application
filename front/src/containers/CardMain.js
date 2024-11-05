import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import UserCard from "../components/cards/UserCard"; // Import UserCard

const baseURL = process.env.REACT_APP_BASE_URL


const SwipeCards = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const currentUserId = 17466; // Replace this with the actual ID of the current user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseURL}/main/suggestions/${currentUserId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data.list);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLike = (id) => {
    console.log("Liked:", id);
    setCurrentIndex((prev) => Math.min(prev + 1, users.length - 1));
  };

  const handleDislike = (id) => {
    console.log("Disliked:", id);
    setCurrentIndex((prev) => Math.min(prev + 1, users.length - 1));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleDislike(users[currentIndex]?.id),
    onSwipedRight: () => handleLike(users[currentIndex]?.id),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div {...swipeHandlers} style={{ position: 'relative' }}>
      {currentIndex < users.length ? (
        <UserCard
          intel={users[currentIndex]}
          uid={currentUserId} // Pass current user ID here
          func={(id, action) => {
            if (action === "like") handleLike(id);
            if (action === "dislike") handleDislike(id);
          }}
          pictures={true} // Adjust based on your logic
        />
      ) : (
        <div>No more users</div>
      )}
    </div>
  );
};

export default SwipeCards;
