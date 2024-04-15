document.addEventListener('initComplete', async function() {

    var gameID = daysSinceStart();
    var victoryModalcloseButton = document.getElementsByClassName('close-button')[0];
    var loseModalcloseButton = document.getElementsByClassName('close-button')[1];
    var rulesModalcloseButton = document.getElementsByClassName('close-button')[2];
    var victoryShareButton = document.getElementsByClassName('share-button')[0];
    var loseShareButton = document.getElementsByClassName('share-button')[1];
    var victoryModal = document.getElementById('victoryModal'); 
    var loseModal = document.getElementById('loseModal');
    var rulesModal = document.getElementById('rulesModal');
    var victoryModalContent = victoryModal.querySelector('.modal-content');
    var loseModalContent = loseModal.querySelector('.modal-content');
    var rulesModalContent = rulesModal.querySelector('.modal-content');
    var victoryModalImage = victoryModal.querySelector('.modal-image');
    var loseModalImage = loseModal.querySelector('.modal-image');
    var correctSong;
    var correctSongAlbumCover;
    var id = window.correctSongId;
    await getCorrectSong(id);
    await getCorrectSongAlbumCover(correctSong);

    const winHeader = document.createElement('h1');
    winHeader.className = 'header';
    winHeader.textContent = `Correct! The song was ${correctSong}.`;
    victoryModalContent.appendChild(winHeader);
    victoryModalImage.src = `/resources/${correctSongAlbumCover}.jpg`;

    const loseHeader = document.createElement('h1');
    loseHeader.className = 'header';
    loseHeader.textContent = `Incorrect! The song was ${correctSong}.`;
    loseModalContent.appendChild(loseHeader);
    loseModalImage.src = `/resources/${correctSongAlbumCover}.jpg`;

    const ruleHeader = document.createElement('h1');
    ruleHeader.textContent = `Welcome to Swiftle!`;
    rulesModalContent.appendChild(ruleHeader);

    const rulePurposeMessage = document.createElement('h5');
    rulePurposeMessage.className = 'rule-purpose-message';
    rulePurposeMessage.textContent = `Guess the mystery Taylor Swift song!`;
    rulesModalContent.appendChild(rulePurposeMessage);

    const rulesList = document.createElement('ul');
    rulesList.className = 'rules-list';

    const rules = [
    "You get eight guesses to guess a mystery song from any of Taylor Swift 10 studio albums! Ranging from Taylor Swift (2006) to Midnights (2022). Deluxe verisons not are included.",
    'Green in any column  indicates a complete match!',
    'Yellow in the album or track number column  indicates that this attribute is within 2 (albums or tracks).',
    'Yellow in the track length column  indicates that the song length is within 30 seconds.',
    'Yellow in the streams column indicates that the songs total streams on Spotify are within 50 million streams.',
    'The arrows are hinting if the correct tracknumber/songlength etc is higher/longer ( ↑ ) or lower/shorter ( ↓ )',
    ];

    rules.forEach(ruleText => {
        const rule = document.createElement('li');
        rule.innerHTML = ruleText.replace(/Green in any column/g, '<span class="green-text">Green in any column</span>')
                                 .replace(/Yellow in the album or track number column/g, '<span class="yellow-text">Yellow in the album or track number column</span>')
                                 .replace(/Yellow in the track length column/g, '<span class="yellow-text">Yellow in the track length column</span>')
                                 .replace(/Yellow in the streams column/g, '<span class="yellow-text">Yellow in the features column</span>');
        rulesList.appendChild(rule);
      });

    rulesModalContent.appendChild(rulesList);

    // When the user clicks on (x), close the modal
    victoryModalcloseButton.onclick = function() {
        victoryModal.style.display = 'none';
    };
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === victoryModal) {
            victoryModal.style.display = 'none';
        }
    };

    victoryShareButton.onclick = function() {
        // Retrieve the guesses from localStorage or however they are stored
        const guesses = JSON.parse(localStorage.getItem('guesses')) || [];
        console.log("we SHARE");

        // Format the guesses into a message
        let message = `Swiftle #${gameID}\n\n`;
        guesses.forEach((guess, index) => {
            var emoji;
            if (index === guesses.length - 1) {
                emoji = '✅';
            }else { 
                emoji = '⬜️';
            }
            message += `${emoji}`;
        });
        message += '\n https://swiftle.org/'; 

        // Copy the message to the clipboard
        navigator.clipboard.writeText(message).then(() => {
            console.log('Results copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy results to clipboard: ', err);
        });

        var notificationBox = document.getElementById('copyNotificationWin');

        // Apply the fadeInOut animation to the notification box
        notificationBox.style.animation = 'fadeInOut 2s';
      
        // Make the notification box visible
        notificationBox.style.display = 'block';
      
        // After 2 seconds, hide the notification box again
        setTimeout(function() {
          notificationBox.style.display = 'none';
          notificationBox.style.animation = ''; // Reset the animation
        }, 2000);
    };
    
    // When the user clicks on (x), close the modal
    loseModalcloseButton.onclick = function() {
        loseModal.style.display = 'none';
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === loseModal) {
            loseModal.style.display = 'none';
        }
    };

    loseShareButton.onclick = function() {
        // Retrieve the guesses from localStorage or however they are stored
        const guesses = JSON.parse(localStorage.getItem('guesses')) || [];

        // Format the guesses into a message
        let message = `Swiftle #${gameID}\n\n`;
        guesses.forEach((guess, index) => {
            var emoji;
            if (index === guesses.length - 1) {
                emoji = '❌';
            }else { 
                emoji = '⬜️';
            }
            message += `${emoji}`;
        });
        message += '\n https://swiftle.org/'; 

        // Copy the message to the clipboard
        navigator.clipboard.writeText(message).then(() => {
            console.log('Results copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy results to clipboard: ', err);
        });

        var notificationBox = document.getElementById('copyNotificationLose');

        // Apply the fadeInOut animation to the notification box
        notificationBox.style.animation = 'fadeInOut 2s';
      
        // Make the notification box visible
        notificationBox.style.display = 'block';
      
        // After 2 seconds, hide the notification box again
        setTimeout(function() {
          notificationBox.style.display = 'none';
          notificationBox.style.animation = ''; // Reset the animation
        }, 2000);
    };

    // When the user clicks on (x), close the modal
    rulesModalcloseButton.onclick = function() {
        rulesModal.style.display = 'none';
    };
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === rulesModal) {
            rulesModal.style.display = 'none';
        }
    };

    async function getCorrectSong(id) {
        try {
            const response = await fetch(`https://swiftle.org/api/correctSong?id=${encodeURIComponent(id)}`);
            const song = await response.json();
            correctSong = song[0].song;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function getCorrectSongAlbumCover(correctSong) {
        try {
            const response = await fetch(`https://swiftle.org/api/album?name=${encodeURIComponent(correctSong)}`);
            const albumCover = await response.json();
            correctSongAlbumCover = albumCover[0].album;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function daysSinceStart() {
        const currentDate = getCurrentDate();
        const startDate = new Date('2024-04-03'); //____________________SET START DATE____________________
        const currentTime = new Date(currentDate);
        const timeDifference = currentTime - startDate;
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        return Math.floor(daysDifference);
      }

    function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    }

});