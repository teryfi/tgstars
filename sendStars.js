const axios = require('axios');

async function sendStars(recipient, amount) {
    const apiKey = '11137358-7661-4dcf-ac1d-892996a69f2c'; // твой ключ
    const url = 'https://api.fragment-api.com/v1/order/stars/';

    const data = {
        recipient: recipient, // например, '@username' или user_id
        amount: amount
    };

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log('Status:', response.status);
        console.log('Ответ:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Ошибка:', error.response.status, error.response.data);
        } else {
            console.error('Ошибка:', error.message);
        }
        throw error;
    }
}

// Пример CLI-запуска: node sendStars.js @username 100
if (require.main === module) {
    const [,, recipient, amount] = process.argv;
    if (!recipient || !amount) {
        console.log('Использование: node sendStars.js @username 100');
        process.exit(1);
    }
    sendStars(recipient, parseInt(amount)).catch(() => process.exit(1));
}

module.exports = sendStars; 