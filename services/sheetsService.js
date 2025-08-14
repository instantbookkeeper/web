const { google } = require('googleapis');
const fs = require('fs');
const path = process.env.AK_PROJECT_JSON;
const credentials = JSON.parse(fs.readFileSync(path, 'utf-8'));
const SPREADSHEET_ID = '1FRj1_Hfx8Qxx5ID2ozBletEZdz6FkoBSSEhI-4utU4o';

async function getOverviewData() {
	const auth = new google.auth.GoogleAuth({
		credentials,
		scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
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
		scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
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
			scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
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
	// Load service account credentials
		const auth = new google.auth.GoogleAuth({
			credentials,
			scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
		});
	
		 const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
	
		 try {
			const GOOGLE_SHEET_RANGE = 'People'; // Adjust as needed
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
						name: obj['name'] || '',
						role: obj['role'] || '',
						department: obj['department'] || '',
						email: obj['email'] || '',
						phone: obj['phone'] || '',
						startDate: obj['startDate'] || '',
						responsibilities: obj['responsibilities'] || '',
						skills: obj['skills'] || '',
					};
			  	});
		 } catch (err) {
			  console.error('Failed to fetch sheets data', err);
			  return [];
		 }
}
module.exports = { getWebToolsData, getGoogleSheetsData, getOverviewData };
