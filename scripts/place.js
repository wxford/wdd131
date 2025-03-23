// Update Footer with Current Year and Last Modified Date
document.getElementById('current-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Wind Chill Calculation Function
function calculateWindChill(temp, windSpeed) {
    return (13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16)).toFixed(2);
}

// Get Temperature and Wind Speed from the Page
const temp = parseFloat(document.getElementById('temp').textContent);
const windSpeed = parseFloat(document.getElementById('wind-speed').textContent);

// Check Conditions and Display Wind Chill
if (temp <= 10 && windSpeed > 4.8) {
    document.getElementById('wind-chill').textContent = calculateWindChill(temp, windSpeed);
} else {
    document.getElementById('wind-chill').textContent = "N/A";
}