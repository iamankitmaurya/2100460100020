import React, { useState } from 'react';
import axios from 'axios';

const AverageCalculator = () => {
    const [type, setType] = useState('e');
    const [data, setData] = useState(null);

    const fetchNumbers = async () => {
        try {
            const response = await axios.get(`http://localhost:9876/numbers/${type}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching numbers:', error);
        }
    };

    return (
        <div>
            <h1>Average Calculator</h1>
            <div>
                <label>Select Number Type: </label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="p">Prime</option>
                    <option value="f">Fibonacci</option>
                    <option value="e">Even</option>
                    <option value="r">Random</option>
                </select>
                <button onClick={fetchNumbers}>Fetch Numbers</button>
            </div>
            {data && (
                <div>
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default AverageCalculator;
