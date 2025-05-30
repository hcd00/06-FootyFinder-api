import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showGames } from "./games.js";

let addEditDiv = null;
let title = null;
let location = null;
let status = null;
let maxPlayers = null;
let addingGame = null

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-game");
  location = document.getElementById("location");
  status = document.getElementById("status");
  addingGame = document.getElementById("adding-game");
  maxPlayers = document.getElementById('max-players');
  title = document.getElementById("title");

  const editCancel = document.getElementById("edit-cancel");
  console.log({ addEditDiv, location, status, addingGame, maxPlayers });
  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingGame) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/games";

        if (addingGame.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/games/${addEditDiv.dataset.id}`;
        }
        // else if (addingGame.textContent === "delete") {
        //   method = "DELETE";
        //   url = `/api/v1/games/${addEditDiv.dataset.id}`;
        // }

        try {
          const options = {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };

          // Only add body for POST or PATCH
          if (method === "POST" || method === "PATCH") {
            options.body = JSON.stringify({
              title: title.value,
              location: location.value,
              status: status.value,
              maxPlayers: maxPlayers.value,
            });
          }

          const response = await fetch(url, options);

          const data = await response.json();
          if (response.ok) {
            if (method === "DELETE") {
              message.textContent = "The game entry was deleted.";
            } else if (method === "PATCH") {
              message.textContent = "The game entry was updated.";
            } else if (method === "POST") {
              message.textContent = "The game entry was created.";
            }

            title.value = ""
            location.value = "";
            maxPlayers.value = "";
            status.value = "pending";

            showGames();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }
        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showGames();
      }
    }
  })
};

export const showAddEdit = async (gameId) => {
  if (!gameId) {
    title.value = "";
    location.value = "";
    status.value = "";
    maxPlayers.value = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/games/${gameId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status == 200) {
        title.value = data.game.title;
        location.value = data.game.location;
        status.value = data.game.status;
        maxPlayers.value = data.game.maxPlayers;
        addingGame.textContent = "update";
        addEditDiv.dataset.id = gameId;
        setDiv(addEditDiv);
      } else {
        message.textContent = "The game entry was not found";
        showGames();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showGames();
    }
    enableInput(true);
  }
};