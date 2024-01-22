/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */

var players = {}
document.addEventListener('DOMContentLoaded', (event) => {
    fetchAndDisplayPlaysFor();
});

async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    loadingGifElem.style.display = 'none';
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  
    });
}

async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function updatePlayerInfo() {
    const oldFirstName = document.getElementById('oldFirstName').value;
    const oldLastName = document.getElementById('oldLastName').value;
    const oldTeamName = document.getElementById('oldTeamName').value;
    const newNickName = document.getElementById('newNickName').value;
    const newSalary = document.getElementById('newSalary').value;
    const newTeamName = document.getElementById('newTeamName').value;

    const response = await fetch('/update-player-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldFirstName, oldLastName, oldTeamName, newNickName, newSalary, newTeamName })
    });

    const responseMessage = await response.text();
    alert(responseMessage);
    fetchAndDisplayPlaysFor();
    fetchAndDisplayTeamsWithMultipleStarPlayers();
}

async function fetchAndDisplayFansSupportingAllTeams() {
    const response = await fetch('/fans-supporting-all-teams');
    const fans = await response.json();
    const listElement = document.getElementById('fansSupportingAllTeamsList');
    
    listElement.innerHTML = '';

    fans.forEach(fan => {
        const listItem = document.createElement('li');
        listItem.textContent = `FanID: ${fan[0]}, Name: ${fan[1]}`; 
        listElement.appendChild(listItem);
    });
}


async function fetchAndDisplayTeamsWithMultipleStarPlayers() {
    const response = await fetch('/teams-with-multiple-star-players');
    const teams = await response.json();
    const listElement = document.getElementById('teamsWithMultipleStarPlayersList');
    listElement.innerHTML = '';
    teams.forEach(team => {
        const listItem = document.createElement('li');
        listItem.textContent = team[0]; 
        listElement.appendChild(listItem);
    });
}

async function fetchGames() {
    const datePlayed = document.getElementById('gameDate').value;
    try {
        const response = await fetch(`/games-on-date?datePlayed=${datePlayed}`);
        const games = await response.json();
        displayGames(games);
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

function displayGames(games) {
    const listElement = document.getElementById('gamesList');

    const table = document.createElement('table');
    table.innerHTML = `<tr><th>Home Team</th><th>Score</th><th>Away Team</th></tr>`;

    games.forEach(game => {
        const row = table.insertRow();
        row.innerHTML = `<td>${game[0]}</td><td>${game[1]}</td><td>${game[2]}</td>`;
    });

    listElement.appendChild(table);
}


// Hashim code ====

async function logFormFields() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var teamName = document.getElementById('teamName').value;
    var salary = document.getElementById("salary").value;
    var NickName = document.getElementById("NickName").value;
    var newTeamName = document.getElementById("newTeamName").value;
    var addNewTeam = teamName === 'new'
   

    const response = await fetch('/insert-player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            teamName: addNewTeam ? newTeamName : teamName,
            salary: salary,
            nickname: NickName,
            newteam: newTeamName,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg'); 

 
    messageElement.style.color = 'red';
    messageElement.style.marginTop = '10px';

    if (responseData.success) {
        messageElement.textContent = "Player inserted successfully!";
        messageElement.style.color = 'green'; 
        await fetchTableData(); 
    } else {
        messageElement.textContent = responseData.message || "Error inserting player!";
    }
}


async function addTable(tableName, ReqFields) {
    try {
        const response = await fetch(`/get-all-data?selectedTable=${encodeURIComponent(tableName)}&reqFields=${encodeURIComponent(ReqFields)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (data.success) {
            var table = document.getElementById('selectedTable');
            var thead = table.getElementsByTagName('thead')[0];
            var tbody = table.getElementsByTagName('tbody')[0];

            thead.innerHTML = '';
            tbody.innerHTML = '';

            var headerRow = thead.insertRow();
            data.data.metaData.forEach(header => {
                var cell = headerRow.insertCell();
                cell.style.textAlign = "left";
                cell.style.fontWeight = "bold";
                cell.style.fontSize = "20px";
                cell.style.marginBottom = "32px";
                cell.textContent = header.name;
            });

            data.data.rows.forEach(row => {
                var newRow = tbody.insertRow();
                row.forEach(cellData => {
                    var cell = newRow.insertCell();
                    cell.style.textAlign = "left";
                    cell.style.fontSize = "16px";
                    cell.textContent = cellData;
                });
            });
        } else {
            console.error('Error fetching data: ', data.message);
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

function showTableHandler() {
    const tableSelect = document.getElementById('tableSelect');
    const fieldsSelect = document.getElementById('fieldsSelect');
    const selectedTable = tableSelect.value;
    const selectedFields = Array.from(fieldsSelect.selectedOptions).map(option => option.value);
    let customString;
    if (selectedFields.length === 0) {
        customString = '*'; 
    } else {
        customString = selectedFields.join(', ');
    }
    addTable(selectedTable, customString)
}

function updateOptions() {
    const tableFields = {
        Teams: ["Name", "WinLossRatio", "Location", "Championships", "CourtID"],
        Managers: ["ManagerID", "LastName", "FirstName", "TeamName"],
        CheersFor: ["CheerleaderID", "Name", "TeamName"],
        Supports: ["FanID", "Name", "TeamName"],
        PlaysFor: ["FirstName", "LastName", "NickName", "TeamName", "Salary"],
        StarPlayer: ["FirstName", "LastName", "TeamName", "PPG", "MPG"],
        Stadium: ["CourtID", "Location", "Capacity"],
        Company: ["CompanyName", "Address", "CourtID"],
        Endorses: ["CompanyName", "FirstName", "LastName", "TeamName", "YearlyDeal"],
        Sponsor: ["CompanyName", "CourtID", "YearlyDeal"],
        Coaches: ["CoachID", "FirstName", "LastName", "Salary", "TeamName"],
        Coached: ["CoachID", "TeamName", "Title"],
        Reporters: ["ReporterID", "Name", "ReportedChannelName", "TeamName"],
        Hosts: ['GameID', "GameScore", "AudienceNumber", "TeamName", "CourtID", 'DatePlayed']
    };
    const tableSelect = document.getElementById('tableSelect');
    const fieldsSelect = document.getElementById('fieldsSelect');
    const selectedTable = tableSelect.value;
    fieldsSelect.innerHTML = '';
    const options = tableFields[selectedTable];
    for (const option of options) {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        fieldsSelect.appendChild(optionElement);
    }
}

async function fetchTeamNames() {
    const response = await fetch('/get-team-names', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const teamNames = await response.json(); 

    const selectElement = document.getElementById('teamName');
    const selectElementSalary = document.getElementById('hpTeam');
    
    teamNames.data.forEach(teamName => {
        const option = document.createElement('option');
        const option2 = document.createElement('option');
        option.value = teamName;
        option.textContent = teamName;
        option2.value = teamName;
        option2.textContent = teamName;
        selectElement.appendChild(option2);
        selectElementSalary.appendChild(option)
    });
}

async function newTeamHandler() {
    var selectedValue = this.value;
    var newTeamContainer = document.getElementById('newTeamContainer');
    var newTeamName = document.getElementById('newTeamName');

    if (selectedValue !== 'new') {
        newTeamContainer.style.display = 'none';
        newTeamName.removeAttribute('required');
    } else {
        newTeamContainer.style.display = 'block';
        newTeamName.setAttribute('required', '');
    }
}

async function highestPlayerHandler() {
    var selectedTeam = document.getElementById('hpTeam').value
    try {
        const response = await fetch(`/get-hp?selectedTable=${encodeURIComponent(selectedTeam)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        
        if (data.success) {
            var table = document.getElementById('hpTable');
            var thead = table.getElementsByTagName('thead')[0];
            var tbody = table.getElementsByTagName('tbody')[0];

            table.style.display = 'block';
            thead.innerHTML = '';
            tbody.innerHTML = '';
            var headerRow = thead.insertRow();
            data.data.metaData.forEach(header => {
                var cell = headerRow.insertCell();
                cell.style.textAlign = "left";
                cell.style.fontWeight = "bold";
                cell.style.fontSize = "15px";
                cell.style.marginBottom = "32px";
                cell.textContent = header.name;
            });
            data.data.rows.forEach(row => {
                var newRow = tbody.insertRow();
                row.forEach(cellData => {
                    var cell = newRow.insertCell();
                    cell.style.textAlign = "left";
                    cell.style.fontSize = "12px";
                    cell.textContent = cellData;
                });
            });
        } else {
            console.error('Error fetching data: ', data.message);
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function fetchPlayers() {
    players = {}

    const response = await fetch('/get-players', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    
    const playersNames = await response.json(); 
    const selectElementF = document.getElementById('DeleteF');
    const selectElementL = document.getElementById('DeleteL');

    selectElementF.innerHTML = '';
    selectElementL.innerHTML = '';

    playersNames.data.rows.forEach(row => {
        const [firstName, lastName] = row;

        if (players.hasOwnProperty(firstName)) {
            players[firstName].push(lastName);
        } else {
            players[firstName] = [lastName];

            const option = document.createElement('option');
            option.value = firstName;
            option.textContent = firstName;
            selectElementF.appendChild(option);
        }
    });

    if (selectElementF.options.length > 0) {
        const firstPlayerFirstName = selectElementF.options[0].value;
        const lastNames = players[firstPlayerFirstName];

        lastNames.forEach(lastName => {
            const option = document.createElement('option');
            option.value = lastName;
            option.textContent = lastName;
            selectElementL.appendChild(option);
        });
    }
    



}

function updateOptionsPlayers() {
    const fSelect = document.getElementById('DeleteF');
    const sSelect = document.getElementById('DeleteL');
    const selectedF = fSelect.value;
    sSelect.innerHTML = '';

    const options = players[selectedF];
    for (const option of options) {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        sSelect.appendChild(optionElement);
    }
}

async function deletePlayer() {
    const fSelect = document.getElementById('DeleteF');
    const sSelect = document.getElementById('DeleteL');
    const selectedF = fSelect.value;
    const selectedL = sSelect.value;
    const messageDiv = document.getElementById('deleteMessage');

    if (selectedL === "" ) {
        messageDiv.textContent = `Last Name Cannot Be Empty`;
        messageDiv.style.color = 'red';
        return;
    }
    try {
        const response = await fetch('/delete-player', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: selectedF,
                lastName: selectedL,
            })
        });

        const responseData = await response.json();

        if (response.ok) {
            messageDiv.textContent = `Player deleted: ${selectedF} ${selectedL}`;
            messageDiv.style.color = 'green';
        } else {
            messageDiv.textContent = `Error: ${responseData.message}`;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.style.color = 'red';
    }

    

    await fetchPlayers()
    
}

function addFilterCondition() {
    const conditionsContainer = document.getElementById('filterConditions');
    const conditionDiv = document.createElement('div');
    conditionDiv.classList.add('condition');
    conditionDiv.innerHTML = `
        <select name="conjunction" style="margin-top:16px; margin-right:16px;">
            <option value="AND">AND</option>
            <option value="OR">OR</option>
        </select>
        <select name="columnName" style="margin-top:16px; margin-right:16px;">
            <option value="CompanyName">Company Name</option>
            <option value="FirstName">First Name</option>
            <option value="LastName">Last Name</option>
            <option value="TeamName">Team Name</option>
            <option value="YearlyDeal">Yearly Deal</option>
        </select>
        <input style="margin-top:16px; margin-right:16px;" type="text" name="value" placeholder="Value">
    `;
    conditionsContainer.appendChild(conditionDiv);
}

function populateTable(rows) {
    const tableBody = document.getElementById('resultsTable').querySelector('tbody');
    tableBody.innerHTML = ''; 

    rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row[0]}</td> <!-- CompanyName -->
            <td>${row[1]}</td> <!-- FirstName -->
            <td>${row[2]}</td> <!-- LastName -->
            <td>${row[3]}</td> <!-- TeamName -->
            <td>${row[4]}</td> <!-- YearlyDeal -->
        `;
        tableBody.appendChild(tr);
    });
}


async function constructSQLQuery() {
    const conditions = document.querySelectorAll('#filterConditions .condition');
    let whereClause = '';

    conditions.forEach((condition, index) => {
        const columnName = condition.querySelector('[name="columnName"]').value;
        const value = condition.querySelector('[name="value"]').value;
        const conjunction = index === 0 ? '' : condition.querySelector('[name="conjunction"]').value;

        whereClause += `${index === 0 ? '' : ' '}${conjunction} ${columnName} = '${value}'`;
    });

    const sqlQuery = `SELECT * FROM Endorses WHERE ${whereClause}`;

    const response = await fetch('/execute-query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sqlQuery })
    });

    const data = await response.json(); 
    
    if (data.success) {
        populateTable(data.data.rows);
    } else {
        console.error('Error:', data.message);
    }

}

async function avgTeamHandler() {
    try {
        const response = await fetch('/get-avg-salary', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

       

        const data = await response.json();
        
        if (data.success) {
            var table = document.getElementById('avgTable');
            var thead = table.getElementsByTagName('thead')[0];
            var tbody = table.getElementsByTagName('tbody')[0];

            table.style.display = 'block';

            thead.innerHTML = '';
            tbody.innerHTML = '';

            var headerRow = thead.insertRow();
            data.data.metaData.forEach(header => {
                var cell = headerRow.insertCell();
                cell.style.textAlign = "left";
                cell.style.fontWeight = "bold";
                cell.style.fontSize = "22px";
                cell.style.marginBottom = "32px";
                cell.style.paddingRight = '32px';
                cell.textContent = header.name;
            });

            data.data.rows.forEach(row => {
                var newRow = tbody.insertRow();
                row.forEach(cellData => {
                    var cell = newRow.insertCell();
                    cell.style.textAlign = "left";
                    cell.style.fontSize = "12px";
                    cell.textContent = cellData;
                });
            });
        } else {
            console.error('Error fetching data: ', data.message);
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function fetchAndDisplayPlaysFor() {
    const tableElement = document.getElementById('playsfor');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/playsfor', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    
    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


// ---------------------------------------------------------------
window.onload = function() {
    checkDbConnection();
    fetchTableData();


    //Hashims Code
    document.getElementById("teamForm").addEventListener("submit", function(event) {
        event.preventDefault(); 
        logFormFields();
    });
    

    document.getElementById('tableSelect').addEventListener('change', function() {
        updateOptions()
    });

    document.getElementById('selectButton').addEventListener('click', function() {
        showTableHandler()
    });

    document.getElementById('hpButton').addEventListener('click', function() {
        highestPlayerHandler()
    });

    document.getElementById('teamName').addEventListener('change', newTeamHandler);

    document.getElementById('DeleteF').addEventListener('change', function() {
        updateOptionsPlayers()
    });

    document.getElementById('deleteB').addEventListener('click', function() {
        deletePlayer()
    });

    document.getElementById('addCond').addEventListener('click', function() {
        addFilterCondition()
    });

    document.getElementById('endorsesS').addEventListener('click', function(e) {
        e.preventDefault(); 
        constructSQLQuery();
      
    });

    document.getElementById('endorsesR').addEventListener('click', function(e) {
        e.preventDefault(); 
        const conditions = document.querySelectorAll('#filterConditions .condition');
        conditions.forEach((condition, index) => {
            if (index > 0) { 
                condition.remove();
            } else { // Reset the first condition's fields
                condition.querySelector('[name="columnName"]').selectedIndex = 0;
                condition.querySelector('[name="value"]').value = '';
            }
        });
    });

    document.getElementById('avgButton').addEventListener('click', function() {
        avgTeamHandler()
    });
    

};


function fetchTableData() {

    //Hashim code
    fetchTeamNames()
    fetchPlayers()

    //Jack
    fetchAndDisplayPlaysFor();

}
