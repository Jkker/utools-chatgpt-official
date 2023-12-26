
const API_URL = 'https://ipapi.co/json/';

const getIPInfo = async () => {
  const response = await fetch(API_URL);
  return await response.json();
}

