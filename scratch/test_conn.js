
const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('http://127.0.0.1:4000/');
    console.log('127.0.0.1 Response:', res.data);
  } catch (e) {
    console.log('127.0.0.1 Error:', e.message);
  }
  try {
    const res = await axios.get('http://localhost:4000/');
    console.log('localhost Response:', res.data);
  } catch (e) {
    console.log('localhost Error:', e.message);
  }
}
test();
