const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const THIRD_PARTY_SERVER = "http://20.244.56.144/test";

let window = [];

// Fetch numbers from the third-party API
const fetchNumbers = async (endpoint) => {
    try {
        const response = await axios.get(`${THIRD_PARTY_SERVER}/${endpoint}`, { timeout: 500 });
        return response.data.numbers;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Check if a number is unique in the current window
const isUnique = (number) => !window.includes(number);

// Update the window with new numbers
const updateWindow = (newNumbers) => {
    const prevWindow = [...window];
    const uniqueNewNumbers = newNumbers.filter(isUnique);

    uniqueNewNumbers.forEach(num => {
        if (window.length >= WINDOW_SIZE) {
            window.shift();
        }
        window.push(num);
    });

    return prevWindow;
};

// Calculate the average of numbers in the window
const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

app.get('/numbers/:type', async (req, res) => {
    const { type } = req.params;
    const endpointMap = {
        'p': 'primes',
        'f': 'fibo',
        'e': 'even',
        'r': 'rand'
    };
    const endpoint = endpointMap[type];
    if (!endpoint) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const newNumbers = await fetchNumbers(endpoint);
    const prevWindow = updateWindow(newNumbers);
    const currentWindow = [...window];
    const average = calculateAverage(currentWindow);

    res.json({
        windowPrevState: prevWindow,
        windowCurrState: currentWindow,
        numbers: newNumbers,
        avg: parseFloat(average.toFixed(2))
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${9876}`);
});
