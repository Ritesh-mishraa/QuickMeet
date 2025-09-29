
let IS_PROD = true; // Change this to true for production


const servers = IS_PROD
  ? "https://quickmeet-mnac.onrender.com"
  : "http://localhost:8000";







export default servers;
