const express = require('express');
const appService = require('./appService');

const router = express.Router();



router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.p

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

router.get('/games-on-date', async (req, res) => {
    const { datePlayed } = req.query;
    try {
        const games = await appService.getGamesOnDate(datePlayed);
        res.json(games);
    } catch (err) {
        res.status(500).send('Error fetching games.');
    }
});

router.post('/update-player-info', async (req, res) => {
    const { oldFirstName, oldLastName, oldTeamName, newNickName, newSalary, newTeamName } = req.body;
    try {
        const result = await appService.updatePlayerInfo(oldFirstName, oldLastName, oldTeamName, newNickName, newSalary, newTeamName);
        if (result > 0) {
            res.status(200).send('Player info updated successfully.');
        } else {
            res.status(404).send('No updates made (Nickname must be unique, player must exist).');
        }
    } catch (err) {
        console.error('Route error: ', err.message);
        res.status(500).send(err.message);
    }
});



router.get('/fans-supporting-all-teams', async (req, res) => {
    try {
        const fans = await appService.getFansSupportingAllTeams();
        res.json(fans);
    } catch (err) {
        res.status(500).send('Error fetching fans supporting all teams.');
    }
});

router.get('/teams-with-multiple-star-players', async (req, res) => {
    try {
        const teams = await appService.getTeamsWithMultipleStarPlayers();
        res.json(teams);
    } catch (err) {
        res.status(500).send('Error fetching teams with multiple star players.');
    }
});


router.get('/playsfor', async (req, res) => {
    const tableContent = await appService.fetchPlaysForFromDb();
    res.json({data: tableContent});
});

/* 
    END OF JACK'S CODE
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
    ****************************************************************************************************************************************************************
*/


//======= Hashims Code ===
router.post('/insert-player', async (req, res) => {
    const { firstName, lastName, teamName, nickname, salary, newteam } = req.body;

    var teamNameD = teamName


    try {
        const insertResult = await appService.insertPlayer({ firstName, lastName, nickname, teamNameD, salary });
        if (insertResult) {
            res.json({
                success: true,
                message: 'Player inserted successfully'
            });
        }    
    } catch (error) {
        if (error.errorNum === 2291) {
            const insertTeamResult = await appService.insertTeam(newteam);
            teamNameD = newteam;
        }
        try {
            const insertResult = await appService.insertPlayer({ firstName, lastName, nickname, teamNameD, salary });
            if (insertResult) {
                res.json({
                    success: true,
                    message: 'Player inserted successfully'
                });
            }    
        } catch (error) {
            res.status(400).json({
                success: false,
                message: `Player with name '${firstName} ${lastName}, Nickname: ${nickname}' already exists`
            });
        }    
    }
});




router.get('/get-fan-data', async (req, res) => {
    try {
        const fanData = await appService.getFanData();

        res.json({
            success: true,
            data: fanData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching fan data',
            error: error.message
        });
    }
});

router.get('/get-all-data', async (req, res) => {
    try {
        const tableName = req.query.selectedTable;
        const reqFields = req.query.reqFields;
        const alldata = await appService.getAllData(tableName, reqFields);

        res.json({
            success: true,
            data: alldata
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching fan data',
            error: error.message
        });
    }
});

router.get('/get-hp', async (req, res) => {
    try {
        const tableName = req.query.selectedTable;
        const alldata = await appService.getHp(tableName);

        res.json({
            success: true,
            data: alldata
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching fan data',
            error: error.message
        });
    }
});

router.get('/get-team-names', async (req, res) => {
    try {
        const teamNames = await appService.getTeamNames();

        res.json({
            success: true,
            data: teamNames
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching fan data',
            error: error.message
        });
    }
});

router.get('/get-players', async (req, res) => {
    try {
        const playerNames = await appService.getPlayers();
        res.json({
            success: true,
            data: playerNames
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching fan data',
            error: error.message
        });
    }
});

router.post('/delete-player', async (req, res) => {
    try {
        const { firstName, lastName } = req.body;

        await appService.deletePlayer(firstName, lastName);

        res.json({
            success: true,
            message: 'Player deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting player',
            error: error.message
        });
    }
});

router.post('/execute-query', async (req, res) => {
    try {
        const { sqlQuery } = req.body;
        const result = await appService.executeQuery(sqlQuery);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error executing query',
            error: error.message
        });
    }
});

router.get('/get-avg-salary', async (req, res) => {

    try {
        const result = await appService.getAvgSalary();
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error executing query',
            error: error.message
        });
    }
});





module.exports = router;