const express = require('express');
const router = express.Router();
const { getWebToolsData, getGoogleSheetsData, getOverviewData, getPeopleData, getSOPData } = require('@services/sheetsService');
    router.get('/', async (req, res) => {
        try {
            const overviewData = await getOverviewData();
            const appsData = await getWebToolsData();
            const googleSheetsData = await getGoogleSheetsData(); 
            const peopleData = await getPeopleData();
            const sopData = await getSOPData();
            res.render('index', {
                overviewData,
                appsData,
                googleSheetsData,
                peopleData,
                sopData,
                errorMessage: null
            });
        } catch (error) {
            res.render('index', {
                overviewData: [],
                appsData: [],
                googleSheetsData: [],
                peopleData: [],
                sopData: [],
                errorMessage: 'Unable to fetch data at the moment. Please try again later.'
            });
        }
    });
module.exports = router;
