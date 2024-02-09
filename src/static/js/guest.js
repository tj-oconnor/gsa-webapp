document.addEventListener('DOMContentLoaded', function () {
    const radarContainer = document.getElementById('radar-container');
    const rocket = document.getElementById('rocket');
    const speed = 2; // Adjust as needed for slower or faster movement

    function getRandomPosition(container, element) {
        const containerRect = container.getBoundingClientRect();
        const maxX = containerRect.width - element.width;
        const maxY = containerRect.height - element.height;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        return { x: randomX, y: randomY };
    }

    function updateRocketPosition() {
        const newPosition = getRandomPosition(radarContainer, rocket);
        const currentX = parseFloat(rocket.style.left || 0);
        const currentY = parseFloat(rocket.style.top || 0);

        // Calculate the difference between the current and target position
        const dx = newPosition.x - currentX;
        const dy = newPosition.y - currentY;

        // Calculate the distance to the target
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < speed) {
            // If the distance is smaller than the speed, set the new position
            rocket.style.left = newPosition.x + 'px';
            rocket.style.top = newPosition.y + 'px';
        } else {
            // Otherwise, move a small step towards the target
            const angle = Math.atan2(dy, dx);
            const stepX = Math.cos(angle) * speed;
            const stepY = Math.sin(angle) * speed;

            rocket.style.left = currentX + stepX + 'px';
            rocket.style.top = currentY + stepY + 'px';
        }

        // Request the next animation frame
        requestAnimationFrame(updateRocketPosition);
    }

    // Initially display the rocket and start animation
    rocket.style.display = 'block';
    updateRocketPosition();
});

document.addEventListener('DOMContentLoaded', function () {
    const textContainer = document.getElementById('random-text');
    const orbitronTextArray = [
        "🚀 Blast off with Galactic Space Adventures! Book now and save 50% on your next interstellar journey!",
        "🌌 Explore the cosmos with Galactic Journeys - Where every trip is a space odyssey!",
        "🌠 Don't miss out on our exclusive Lunar Exploration Packages! Limited spots available!",
        "🪐 Discover the universe's secrets with our advanced satellite technology. Rent a satellite today!",
        "🌟 Join CEO Elara Vexx on an unforgettable space voyage. Book your ticket now!",
        "🌌 Get ready for an out-of-this-world experience with Galactic Space Adventures!",
        "🛰️ Want to see the dark side of the moon? We can take you there! Book today!",
        "🪐 Your dream of space travel is just a click away. Explore the stars with us!",
        "🚀 Galactic Journeys: Where dreams of interstellar exploration become reality!",
        "🌌 Experience zero-gravity fun with our Lunar Exploration Packages. Reserve your spot today!",
        "🌠 Uncover the mysteries of the universe with Galactic Space Adventures. Book now and save big!",
        "🪐 Book your discounted space airfare with us and embark on a cosmic adventure!",
        "🌟 Join the ranks of space pioneers with Galactic Journeys. Your journey begins here!",
        "🛰️ Don't miss the chance to rent our cutting-edge satellites for your research needs!",
        "🌌 Galactic Space Adventures - Your gateway to the stars. Book now and reach for the skies!"
    ];

    function getRandomText() {
        const randomIndex = Math.floor(Math.random() * orbitronTextArray.length);
        return orbitronTextArray[randomIndex];
    }

    function slowPrintText(text, container) {
        let index = 0;

        function printNextCharacter() {
            if (index < text.length) {
                container.textContent += text.charAt(index);
                index++;
                setTimeout(printNextCharacter, 100); // Adjust the delay (in milliseconds) between characters
            } else {
                // Text finished displaying, replace it with new text
                container.textContent = ''; // Clear the container
                const randomText = getRandomText();
                slowPrintText(randomText, container);
            }
        }

        printNextCharacter();
    }

    // Start with initial random text
    const initialText = getRandomText();
    slowPrintText(initialText, textContainer);
});