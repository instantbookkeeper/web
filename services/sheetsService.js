const { google } = require('googleapis');

// Safely parse credentials from environment variable
let credentials;
try {
	if (!process.env.AK_PROJECT_JSON) {
		throw new Error('AK_PROJECT_JSON environment variable is missing.');
	}
	credentials = JSON.parse(process.env.AK_PROJECT_JSON);
} catch (err) {
	credentials = null;
}

const googleSheetAPIUrl = process.env.GOOGLE_SHEET_API_URL;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function getOverviewData() {
	const auth = new google.auth.GoogleAuth({
		credentials,
		scopes: [googleSheetAPIUrl],
	});

  	const sheets = google.sheets({ version: 'v4', auth });

	const range = 'Overview'; // Example: skip header, get rows from A2 to C
  	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: SPREADSHEET_ID,
		range: range,
	});

	const rows = response.data.values;

	if (!rows || rows.length <= 1) return {}; // No data
	
	const dataRows = rows.slice(1); // Skip the header row

  	const grouped = {};
  	dataRows.forEach(row => {
		const [rawSection, name, description, icon, url] = row;
		const section = rawSection.trim(); // Normalize the section name
		if (!grouped[section]) {
			grouped[section] = [];
		}

		grouped[section].push({
			name,
			description,
			icon,
			url,
		});
   });

   return Object.keys(grouped).length ? grouped : null;
}

async function getWebToolsData() {

	const auth = new google.auth.GoogleAuth({
		credentials,
		scopes: [googleSheetAPIUrl],
	});

  	const sheets = google.sheets({ version: 'v4', auth });

	const range = 'Web Tools'; // Example: skip header, get rows from A2 to C
  	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: SPREADSHEET_ID,
		range: range,
	});

	const rows = response.data.values;

	if (!rows || rows.length <= 1) return {}; // No data
	
	const dataRows = rows.slice(1); // Skip the header row

  	const grouped = {};
  	dataRows.forEach(row => {
		const [rawSection, name, description, icon, url] = row;
		const section = rawSection.trim(); // Normalize the section name
		if (!grouped[section]) {
			grouped[section] = [];
		}

		grouped[section].push({
			name,
			description,
			icon,
			url,
		});
   });

   return Object.keys(grouped).length ? grouped : null;
}

async function getGoogleSheetsData() {

	// Load service account credentials
	const auth = new google.auth.GoogleAuth({
		credentials,
		scopes: [googleSheetAPIUrl],
	});

	const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

	try {
		const GOOGLE_SHEET_RANGE = 'Google Sheets Tab'; // Adjust as needed
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: SPREADSHEET_ID,
			range: GOOGLE_SHEET_RANGE,
		});
		const rows = response.data.values || [];
		// Use first row as header
		const headers = rows[0].map(h => h.trim().toLowerCase());
		const dataRows = rows.slice(1);

		return dataRows.map(row => {
			const obj = {};
			headers.forEach((header, idx) => {
				const key = header.replace(/\s+/g, '_'); // replace spaces with underscores
				obj[key] = row[idx] || '';
			});
			return {
				name: obj['sheet_name'] || '',
				category: obj['category'] || '',
				description: obj['description'] || '',
				tags: obj['tags'] || '',
				url: obj['sheet_link'] || '',
				icon: obj['icon_url'] || ''
			};
		});
	} catch (err) {
		console.error('Failed to fetch sheets data', err);
		return [];
	}
}

async function getPeopleData() {
	const auth = new google.auth.GoogleAuth({
		credentials,
		scopes: [googleSheetAPIUrl],
	});
	const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
	try {
		const GOOGLE_SHEET_RANGE = 'People'; // Adjust as needed
		const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: GOOGLE_SHEET_RANGE,
        });
		const rows = response.data.values;
        if (!rows || rows.length <= 1) return {}; // No data
        const headers = rows[0].map(h => h.trim().toLowerCase());
        const departmentMap = {};
		rows.slice(1).forEach(row => {
            const obj = {};
            headers.forEach((header, idx) => {
                obj[header] = row[idx] || '';
            });
            const department = obj['department'] || 'Other'; // Use 'department' for grouping
            if (!departmentMap[department]) departmentMap[department] = [];
            departmentMap[department].push({
                name: obj['name'] || '',
                role: obj['role'] || '',
				department: department,
				email: obj['email'] || '',
				short_desc: obj['short description'] || '',
                phone: obj['phone'] || '',
                startDate: obj['startdate'] || '',
                responsibilities: obj['responsibilities'] || '',
                skills: obj['skills'] || ''
            });
        });
        return departmentMap;
	 } catch (err) {
		  console.error('Failed to fetch sheets data', err);
		  return [];
	 }
		
}

async function getSOPData() {
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: [googleSheetAPIUrl],
    });
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    try {
        const GOOGLE_SHEET_RANGE = 'SOP'; // Adjust as needed
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: GOOGLE_SHEET_RANGE,
        });
        const rows = response.data.values;
        if (!rows || rows.length <= 1) return []; // No data

        const headers = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
        const dataRows = rows.slice(1);

        return dataRows.map(row => {
            const obj = {};
            headers.forEach((header, idx) => {
                obj[header] = row[idx] || '';
            });
            return {
                category: obj['category'],
                title: obj['title'],
                description: obj['description'],
                sopData: obj['sop_data'], // JSON string
            };
        });
    } catch (err) {
        console.error('Failed to fetch SOP data', err);
        return [];
    }
}
module.exports = { getWebToolsData, getGoogleSheetsData, getOverviewData, getPeopleData, getSOPData };
