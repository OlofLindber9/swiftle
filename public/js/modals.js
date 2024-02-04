document.addEventListener('initComplete', async function() {

    var victoryModalcloseButton = document.getElementsByClassName('close-button')[0];
    var loseModalcloseButton = document.getElementsByClassName('close-button')[1];
    var rulesModalcloseButton = document.getElementsByClassName('close-button')[2];
    var victoryModal = document.getElementById('victoryModal'); 
    var loseModal = document.getElementById('loseModal');
    var rulesModal = document.getElementById('rulesModal');
    var victoryModalContent = victoryModal.querySelector('.modal-content');
    var loseModalContent = loseModal.querySelector('.modal-content');
    var rulesModalContent = rulesModal.querySelector('.modal-content');
    var victoryModalImage = victoryModal.querySelector('.modal-image');
    var loseModalImage = loseModal.querySelector('.modal-image');
    console.log('HELLO');
    var correctSong;
    var correctSongAlbumCover;
    console.log(window.correctSongId);
    var id = window.correctSongId;
    await getCorrectSong(id);
    await getCorrectSongAlbumCover(correctSong);

    if(correctSongAlbumCover === "Cole World: The Sideline Story") {
        correctSongAlbumCover = "Cole World The Sideline Story";
    }

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
    ruleHeader.textContent = `Welcome to ColeWordle!`;
    rulesModalContent.appendChild(ruleHeader);

    const rulePurposeMessage = document.createElement('h5');
    rulePurposeMessage.className = 'rule-purpose-message';
    rulePurposeMessage.textContent = `Guess the mystery J. Cole song!`;
    rulesModalContent.appendChild(rulePurposeMessage);

    const rulesList = document.createElement('ul');
    rulesList.className = 'rules-list';

    const rules = [
    "You get eight guesses to guess a mystery song from any of J. cole's 6 studio albums!",
    'Green in any column  indicates a complete match!',
    'Yellow in the album or track number column  indicates that this attribute is within 2 (albums or tracks).',
    'Yellow in the track length column  indicates that the song length is within 30 seconds.',
    'Yellow in the features column  indicates that at least one of the featured artists is correct.',
    'The arrows are hinting if the correct tracknumber/songlength is higher/longer ( ↑ ) or lower/shorter ( ↓ )',
    ];

    rules.forEach(ruleText => {
        const rule = document.createElement('li');
        rule.innerHTML = ruleText.replace(/Green in any column/g, '<span class="green-text">Green in any column</span>')
                                 .replace(/Yellow in the album or track number column/g, '<span class="yellow-text">Yellow in the album or track number column</span>')
                                 .replace(/Yellow in the track length column/g, '<span class="yellow-text">Yellow in the track length column</span>')
                                 .replace(/Yellow in the features column/g, '<span class="yellow-text">Yellow in the features column</span>');
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
            const response = await fetch(`http://localhost:5500/api/correctSong?id=${encodeURIComponent(id)}`);
            const song = await response.json();
            correctSong = song[0].song;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function getCorrectSongAlbumCover(correctSong) {
        try {
            const response = await fetch(`http://localhost:5500/api/album?name=${encodeURIComponent(correctSong)}`);
            const albumCover = await response.json();
            correctSongAlbumCover = albumCover[0].album;
        } catch (error) {
            console.error('Error:', error);
        }
    }

});