const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('./.env');

const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
};
// ----------------------------------------------------------
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
// ----------------------------------------------------------

async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}



/* JACK'S code
    Functions written by Jack Gao for the project
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
*/

async function updatePlayerInfo(oldFirstName, oldLastName, oldTeamName, newNickName, newSalary, newTeamName) {
    return await withOracleDB(async (connection) => {
        let updates = [];
        let params = {};


        if (newNickName) {
            const isNickNameUnique = await checkNickNameUnique(newNickName, oldFirstName, oldLastName, connection);
            if (!isNickNameUnique) {
                throw new Error('NickName already in use');
            }
        }
        if (newNickName) {
            updates.push(`NickName = :newNickName`);
            params.newNickName = newNickName;
        }
        if (newSalary) {
            updates.push(`Salary = :newSalary`);
            params.newSalary = newSalary;
        }

        let updateStarPlayer = false;
        if (newTeamName && newTeamName !== oldTeamName) {
            const teamExists = await checkTeamExists(newTeamName, connection);
            if (!teamExists) {
                throw new Error('Invalid new TeamName');
            }
            updates.push(`TeamName = :newTeamName`);
            params.newTeamName = newTeamName;
            updateStarPlayer = true;
        }

        if (updates.length === 0) {
            return 0; 
        }

        params.oldFirstName = oldFirstName;
        params.oldLastName = oldLastName;
        params.oldTeamName = oldTeamName;

        const query = `
            UPDATE PlaysFor
            SET ${updates.join(', ')}
            WHERE FirstName = :oldFirstName AND LastName = :oldLastName AND TeamName = :oldTeamName
        `;

        const result = await connection.execute(query, params, { autoCommit: false });

        if (updateStarPlayer) {
            await connection.execute(
                `UPDATE StarPlayer
                 SET TeamName = :newTeamName
                 WHERE FirstName = :oldFirstName AND LastName = :oldLastName AND TeamName = :oldTeamName`,
                params,
                { autoCommit: false }
            );
        }

        await connection.commit();

        return result.rowsAffected;
    }).catch(() => {
        return [];
    });
}

async function checkNickNameUnique(nickName, firstName, lastName, connection) {
    const result = await connection.execute(
        `SELECT COUNT(*) FROM PlaysFor WHERE NickName = :nickName AND NOT (FirstName = :firstName AND LastName = :lastName)`,
        { nickName, firstName, lastName }
    );
    return result.rows[0][0] === 0;
}


async function checkTeamExists(teamName, connection) {
    const result = await connection.execute(
        `SELECT COUNT(*) FROM Teams WHERE Name = :teamName`, 
        { teamName }
    );
    return result.rows[0][0] > 0;
}



async function getFansSupportingAllTeams() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT DISTINCT s.FanID, s.Name
            FROM Supports s
            WHERE NOT EXISTS (
                SELECT t.Name
                FROM Teams t
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM Supports s2
                    WHERE s2.FanID = s.FanID AND s2.TeamName = t.Name
                )
            )
        `);
        return result.rows;
    });
}

async function getTeamsWithMultipleStarPlayers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT TeamName
            FROM (
                SELECT TeamName, COUNT(*) AS StarPlayerCount
                FROM StarPlayer
                GROUP BY TeamName
                HAVING COUNT(*) >= 2
            )
        `);
        return result.rows;
    });
}


async function fetchPlaysForFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PLAYSFOR');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getGamesOnDate(datePlayed) {
    return await withOracleDB(async (connection) => {
    
        const formattedDate = datePlayed.split('-').reverse().join('-');
        const result = await connection.execute(
            `SELECT t.Name AS HomeTeam, h.GameScore, h.TeamName AS AwayTeam
             FROM Teams t, Hosts h
             WHERE h.CourtID = t.CourtID AND h.DatePlayed = :formattedDate`,
            { formattedDate }
        );
        return result.rows;
    });
}


/* 
    END OF JACK'S CODE
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************

*/



//Hashim Code ======
async function insertPlayer(playerData) {
    return await withOracleDB(async (connection) => {
        // SQL command to insert a player
        const sql = `
            INSERT INTO PlaysFor
            VALUES (:firstName, :lastName, :nickname, :teamName, :salary)
        `;

        // Parameters for the SQL command
        const params = {
            firstName: playerData.firstName,
            lastName: playerData.lastName,
            nickname: playerData.nickname,
            teamName: playerData.teamNameD,
            salary: playerData.salary
        };

       
        const result = await connection.execute(sql, params, { autoCommit: true });
        
        // Check if the row was inserted successfully
        if (result.rowsAffected && result.rowsAffected > 0) {
            return true;
        } else {
            return false;
        }
    }).catch((error) => {
        throw error
    });
}





async function insertTeam(team) {
    try {
        return await withOracleDB(async (connection) => {
            const sql = `
            INSERT INTO Teams
            VALUES (:teamName, :winLossRatio, :location, :championships, :courtid)
            `;
            
            const params = {
                teamName: team.toString(), // Assuming teamName is a string
                winLossRatio: '0:0', // Adjust type as needed
                location: 'Unknown', // Empty string
                championships: 0 // Assuming championships is a number
            };


            
            const result = await connection.execute(sql, params, { autoCommit: true });
            return result
        });
    } catch (error) {
        console.error('Error in insert team:', error);
        throw error;
    }
}

async function getTeamNames() {
    try {
        return await withOracleDB(async (connection) => {
            const sql = `SELECT Name FROM Teams`;

            const result = await connection.execute(sql);
            
            return result.rows.map(row => row[0]);
        });
    } catch (error) {
        console.error('Error in getFanData:', error);
        throw error;
    }
}
async function getAllData(tableName, reqFields) {
    try {
        return await withOracleDB(async (connection) => {
            const sql = `SELECT ${reqFields} FROM ${tableName}`;


            const result = await connection.execute(sql);

        

        
            return result;
        });
    } catch (error) {
        console.error('Error in getFanData:', error);
        throw error;
    }
}

async function getHp(teamName) {
    try {
        return await withOracleDB(async (connection) => {
            const sql = `
                SELECT
                    FirstName, LastName, MAX(Salary) AS MaxSalary
                FROM
                    PlaysFor
                WHERE
                    TeamName = '${teamName}'
                GROUP BY
                    FirstName, LastName
                HAVING
                    MAX(Salary) = (SELECT MAX(Salary) FROM PlaysFor WHERE TeamName = '${teamName}')
            `;

            const result = await connection.execute(sql);

            
            return result;
        });
    } catch (error) {
        console.error('Error in getFanData:', error);
        throw error;
    }
}

async function getPlayers() {
    try {
        return await withOracleDB(async (connection) => {
            const sql = `SELECT FirstName, LastName FROM PlaysFor`;

            const result = await connection.execute(sql);
            
            return result;
        });
    } catch (error) {
        console.error('Error in getFanData:', error);
        throw error;
    }
}

async function deletePlayer(firstName, lastName) {
    try {
        return await withOracleDB(async (connection) => {
            const sql = `DELETE FROM PlaysFor WHERE FirstName = :firstName AND LastName = :lastName`;
            const result = await connection.execute(sql, { firstName, lastName }, { autoCommit: true });
            return result;
        });
    } catch (error) {
        console.error('Error in deletePlayer:', error);
        throw error;
    }
}

async function executeQuery(sqlQuery) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(sqlQuery, [], { autoCommit: true });
            return result;
        });
    } catch (error) {
        console.error('Error in executeQuery:', error);
        throw error;
    }
}

async function getAvgSalary() {
    try {
        return await withOracleDB(async (connection) => {
            const sqlQuery = `
                SELECT TeamName, AVG(Salary) AS AverageSalary
                FROM PlaysFor
                GROUP BY TeamName
            `; 
            const result = await connection.execute(sqlQuery, [], { autoCommit: true });
            return result;
        });
    } catch (error) {
        console.error('Error in getAvgSalary:', error);
        throw error;
    }
}











module.exports = {
    testOracleConnection,
    
    //Hashim code =====
    insertPlayer,
    getTeamNames,
    insertTeam,
    getAllData,
    getHp,
    getPlayers,
    deletePlayer,
    executeQuery,
    getAvgSalary,

    /* JACK */
    fetchPlaysForFromDb,
    getTeamsWithMultipleStarPlayers,
    getFansSupportingAllTeams,
    updatePlayerInfo,
    getGamesOnDate
    /* JACK */
};