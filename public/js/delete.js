import { token, message } from "./index.js";
import { showGames } from "./games.js";

export const handleDelete = async (gameId) => {
  try {
    console.log("gameID", gameId);
    
    const response = await fetch(`/api/v1/games/${gameId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      message.textContent = "Game deleted.";
      showGames();  // Refresh the table
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.error(err);
    message.textContent = "A communication error occurred.";
  }
};