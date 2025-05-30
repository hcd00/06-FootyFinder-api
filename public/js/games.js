import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    token,
    enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { handleDelete } from "./delete.js";

let gamesDiv = null;
let gamesTable = null;
let gamesTableHeader = null;

export const handleGames = () => {
    gamesDiv = document.getElementById('games');
    const logoff = document.getElementById('logoff');
    const addGame = document.getElementById('add-game');
    gamesTable = document.getElementById('games-table');
    gamesTableHeader = document.getElementById('games-table-header');

    gamesDiv.addEventListener("click", (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {

            if (e.target === addGame) {
                showAddEdit(null);
            }

            else if (e.target === logoff) {
                setToken(null);
                message.textContent = "You have been logged off.";
                gamesTable.replaceChildren([gamesTableHeader]);
                showLoginRegister();

            } else if (e.target.classList.contains("editButton")) {
                message.textContent = "";
                showAddEdit(e.target.dataset.id);
            }
            else if (e.target.classList.contains("deleteButton")) {
                message.textContent = "";      
                handleDelete(e.target.dataset.id);
            }
        }
    });
};

export const showGames = async () => {
    try {
        enableInput(false);

        const response = await fetch("/api/v1/games", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        let children = [gamesTableHeader];

        if (response.status === 200) {
            if (data.count === 0) {
                gamesTable.replaceChildren(...children); // Clear table
            } else {
                for (let i = 0; i < data.games.length; i++) {
                    let rowEntry = document.createElement("tr");

                    // Buttons
                    let editButton = `<button type="button" class="editButton" data-id="${data.games[i]._id}">Edit</button>`;
                    let deleteButton = `<button type="button" class="deleteButton" data-id="${data.games[i]._id}">Delete</button>`;

                    // Row HTML
                    let rowHTML = `
                <td>${data.games[i].title}</td>
                <td>${data.games[i].location}</td>
                <td>${data.games[i].status}</td>
                <td>${data.games[i].isFull}</td>
                <td>${data.games[i].maxAmountPlayers}</td>
                <td>${data.games[i].waitList}</td>
                <td>${editButton} ${deleteButton}</td>
            `;

                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                gamesTable.replaceChildren(...children);
            }
        } else {
            message.textContent = data.msg;
        }

    } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
    }
    enableInput(true);
    setDiv(gamesDiv);
};
