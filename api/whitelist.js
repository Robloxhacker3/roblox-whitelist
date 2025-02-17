const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const filePath = path.join(__dirname, 'whitelist.json');

    if (req.method === 'GET') {
        // Return the whitelist
        const whitelist = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return res.json(whitelist);
    }

    if (req.method === 'POST') {
        const { username } = req.body;
        if (!username) return res.status(400).json({ error: 'Username required' });

        // Load whitelist
        let whitelist = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (whitelist.whitelisted_users.includes(username)) {
            return res.json({ message: `${username} is already whitelisted` });
        }

        // Add the user
        whitelist.whitelisted_users.push(username);
        fs.writeFileSync(filePath, JSON.stringify(whitelist, null, 2));

        return res.json({ message: `${username} has been added to the whitelist` });
    }

    res.status(405).json({ error: 'Method Not Allowed' });
};
