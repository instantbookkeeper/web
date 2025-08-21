const express = require('express');
const router = express.Router();
const { getWebToolsData, getGoogleSheetsData, getOverviewData, getPeopleData, getSOPData, getAccountsAndEntitiesData } = require('@services/sheetsService');
router.get('/', async (req, res) => {
    try {
        const overviewData = await getOverviewData();
        const appsData = await getWebToolsData();
        const googleSheetsData = await getGoogleSheetsData(); 
        const peopleData = await getPeopleData();
        const sopData = await getSOPData();
        const { entities, accounts } = await getAccountsAndEntitiesData(); // Fetch entities and accounts
        res.render('index', {
            overviewData,
            appsData,
            googleSheetsData,
            peopleData,
            sopData,
            entities,
            accounts, 
            errorMessage: null
        });
    } catch (error) {
        res.render('index', {
            overviewData: [],
            appsData: [],
            googleSheetsData: [],
            peopleData: [],
            sopData: [],
            entities: [],
            accounts: [],
            errorMessage: 'Unable to fetch data at the moment. Please try again later.'
        });
    }
});
module.exports = router;
