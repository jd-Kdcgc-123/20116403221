const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const testServerURL = "http://20.244.56.144/test";
const WINDOW_SIZE = 10;
const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIwNzA3MjE0LCJpYXQiOjE3MjA3MDY5MTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImRiYjEzMzExLTIxY2EtNGQwYi1hMWI2LTdlMDZhYzg1NDE4YyIsInN1YiI6ImplZXdhbnQuYnRlY2hAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiSmRUZWNoIiwiY2xpZW50SUQiOiJkYmIxMzMxMS0yMWNhLTRkMGItYTFiNi03ZTA2YWM4NTQxOGMiLCJjbGllbnRTZWNyZXQiOiJnVUNQeXlvdWtGUFJSWVJxIiwib3duZXJOYW1lIjoiSmVld2FudCIsIm93bmVyRW1haWwiOiJqZWV3YW50LmJ0ZWNoQGdtYWlsLmNvbSIsInJvbGxObyI6IjIwMTE2NDAzMjIxIn0.oWkUPW--HA9Lkvdbx8_7p6dClInoMF23BwZhK1LB8fM";

let windowCurrState = [];

const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

const fetchNumbersFromTestServer = async (type) => {
  try {
    const response = await axios.get(`${testServerURL}/${type}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    return response.data.numbers;
  } catch (error) {
    console.error("Error fetching data from Test Server", error);
    return [];
  }
};

const mp = {
  p: "primes",
  e: "even",
  f: "fibo",
  r: "rand",
};

app.get("/numbers/:qualifiedId", async (req, res) => {
  const { qualifiedId } = req.params;

  const numbers = await fetchNumbersFromTestServer(mp[qualifiedId]);

  const uniqueNumbers = [...new Set(numbers)];

  const windowPrevState = [...windowCurrState];
  windowCurrState = [...windowCurrState, ...uniqueNumbers];

  if (windowCurrState.length > WINDOW_SIZE) {
    windowCurrState = windowCurrState.slice(-WINDOW_SIZE);
  }

  const avg = calculateAverage(windowCurrState);

  res.json({
    numbers: uniqueNumbers,
    windowPrevState,
    windowCurrState,
    avg,
  });
});

app.listen(9876, () => {
  console.log(`Server is running on port 9876.`);
});
