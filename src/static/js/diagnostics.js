document.addEventListener('DOMContentLoaded', function () {
    const fuelProgress = document.getElementById('fuel-progress');
    const velocityProgress = document.getElementById('velocity-progress');
    const temperatureProgress = document.getElementById('temperature-progress');

    function updateFuel() {
        const fuelValue = parseFloat(fuelProgress.getAttribute('data-value'));
        if (fuelValue <= 0) {
            fuelProgress.setAttribute('data-value', '100');
            fuelProgress.style.width = '100%';
            document.getElementById('fuel-value').textContent = 'Rocket Refueling Complete';
        } else {
            const newFuelValue = (fuelValue - 0.1).toFixed(2);
            fuelProgress.setAttribute('data-value', newFuelValue);
            fuelProgress.style.width = newFuelValue + '%';
            document.getElementById('fuel-value').textContent = newFuelValue + ' %';
        }
    }

    function updateVelocity() {
        const velocityValue = parseInt(velocityProgress.getAttribute('data-value'));
        const randomChange = Math.floor(Math.random() * 5000) - 1; // -1, 0, or 1
        const newVelocityValue = randomChange;
        velocityProgress.setAttribute('data-value', (0));
        velocityProgress.style.width = ((newVelocityValue +5000)/ 50).toFixed(2) + 'mph';
        document.getElementById('velocity-value').textContent = newVelocityValue + ' mph';
    }

    function updateTemperature() {
        const temperatureValue = parseInt(temperatureProgress.getAttribute('data-value'));
        const randomChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newTemperatureValue = temperatureValue + randomChange;
        temperatureProgress.setAttribute('data-value', newTemperatureValue);
        temperatureProgress.style.width = ((newTemperatureValue + 500) / 50).toFixed(2) + '°F';
        document.getElementById('temperature-value').textContent = newTemperatureValue + ' °F';
    }

    setInterval(updateFuel, 1000);
    setInterval(updateVelocity, 1000);
    setInterval(updateTemperature, 1000);
});
