document.addEventListener('initComplete', async function() {

    const targetSong = await getCorrectSong(window.correctSongId);
    const submitButton = document.getElementById("submit-guess");
    const guessInput = document.getElementById("guess-input");
    const gameDiv = document.querySelector(".attempts");
    const rulesButton = document.getElementById("rules-button");
    const attemptLimit = 8;
    const AlbumOrder = {
        "Taylor Swift": 1,
        "Fearless": 2,
        "Speak Now": 3,
        "Red": 4,
        "1989": 5,
        "Reputation": 6,
        "Lover": 7,
        "Folklore": 8,
        "Evermore": 9,
        "Midnights": 10
    };
    let numberOfAttempts = 0;
    var gameOver = false;
    var victoryModal = document.getElementById('victoryModal'); 
    var loseModal = document.getElementById('loseModal');
    var rulesModal = document.getElementById('rulesModal');


    const headerRow = document.createElement('li');
    const attemptsDiv = document.createElement('li');  
    attemptsDiv.style.listStyleType = 'none';
    headerRow.className = "matrix-row";
    attemptsDiv.className = "guessesMatrix";
    gameDiv.appendChild(headerRow); 

    const songNameheader = document.createElement('div');
    songNameheader.className = 'header-matrixlabel';
    songNameheader.textContent = 'Song'
    headerRow.appendChild(songNameheader);

    const songAlbumheader = document.createElement('div');
    songAlbumheader.className = 'header-matrixlabel';
    songAlbumheader.textContent = 'Album'
    headerRow.appendChild(songAlbumheader);

    const songNumberheader = document.createElement('div');
    songNumberheader.className = 'header-matrixlabel';
    songNumberheader.textContent = 'Track No.'
    headerRow.appendChild(songNumberheader);

    const songLengthheader = document.createElement('div');
    songLengthheader.className = 'header-matrixlabel';
    songLengthheader.textContent = 'Track Length'
    headerRow.appendChild(songLengthheader);

    const songStreamsheader = document.createElement('div');
    songStreamsheader.className = 'header-matrixlabel';
    songStreamsheader.textContent = 'Streams'
    headerRow.appendChild(songStreamsheader); 
    //resetGuesses();
    //completeReset();
    checkGameStatus();


    async function getCorrectSong(id) {
        try {
            const response = await fetch(`http://90.224.206.14:81/api/correctSong?id=${encodeURIComponent(id)}`);
            const song = await response.json();
            return song[0].song;
        } catch (error) {
            console.error('Error:', error);
        }
    }


    submitButton.addEventListener("click", async function() {
        
        if(gameOver){
            return;
        }
        
        const guess = guessInput.value;
        
        var validInput = await checkInput(guess);
        if (guess.length === 1){
            validInput = false;
        }
        if (!validInput || guess === '') {
            alert("That is not a song. Try again");
            guessInput.value = '';
            return;
        }

        const victory = await checkIfVictory(guess, targetSong);
        if (victory) {
            const guessRow = document.createElement('li');  
            guessRow.className = "matrix-row"; 
            await displayAttempt(guess, guessRow); 
            guessInput.value = '';
            gameOver = true; 
            victoryModal.style.display = 'block';  
            playGameOverSound(targetSong);
            saveGameState('win');   
            saveGuess(guess, numberOfAttempts);        
            return;
        }

        numberOfAttempts++

        saveGuess(guess, numberOfAttempts);

        if (numberOfAttempts >= attemptLimit){
            if (numberOfAttempts <= attemptLimit){
                const guessRow = document.createElement('li');  
                guessRow.className = "matrix-row"; 
                await displayAttempt(guess, guessRow);   
            }
            loseModal.style.display = 'block';
            saveGameState('lose');   
            return;
        }

        const guessRow = document.createElement('li');  
        guessRow.className = "matrix-row"; 
        await displayAttempt(guess, guessRow);
        
        // Clear the input for the next guess
        guessInput.value = '';
        guessInput.placeholder = `Guess ${numberOfAttempts + 1}/8`
    });

    rulesButton.addEventListener("click", function() {
        rulesModal.style.display = 'block';  
    });


    function displaySongName(guess, songNameCell) {
    
        let encodedSongName = encodeURIComponent(guess);
        let url = `http://90.224.206.14:81/api/name?name=${encodedSongName}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                songNameCell.textContent = data[0].name;


                if (data[0].name.toLowerCase() === targetSong.toLowerCase()) {
                    songNameCell.classList.add('green');
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function displaySongAlbum(guess, songAlbumCell){

        var info;
        let albumName;
        let guessAlbum; 

        let encodedSongName = encodeURIComponent(guess);
        let url = `http://90.224.206.14:81/api/album?name=${encodedSongName}`

        let encodedTargetSongName = encodeURIComponent(targetSong);
        let url2 = `http://90.224.206.14:81/api/album?name=${encodedTargetSongName}`

        fetch(url)
        .then(response => response.json())
        .then(data => {
            info = data;
            albumName = info[0].album;
            var albumImage = document.createElement('img');
            albumImage.className = 'album-image';
            albumImage.src = `/resources/${albumName}.jpg`;
            guessAlbum = info[0].album;
            songAlbumCell.classList.add('image');
            songAlbumCell.appendChild(albumImage);
            return fetch(url2);
        })
        .then(response => response.json())
        .then(data => {

            var arrowText = document.createElement('span');
            arrowText.className = 'arrow-text';

            if(AlbumOrder[guessAlbum] < AlbumOrder[data[0].album]){
                arrowText.textContent ='   ↑';
                songAlbumCell.appendChild(arrowText);
            }else if (AlbumOrder[guessAlbum] > AlbumOrder[data[0].album]){
                arrowText.textContent ='   ↓';
                songAlbumCell.appendChild(arrowText);
            }

            if ((AlbumOrder[guessAlbum] - AlbumOrder[data[0].album]) === 0){
                songAlbumCell.classList.add('green');
            }
            else if (Math.abs(AlbumOrder[guessAlbum] -  AlbumOrder[data[0].album]) < 3){
                songAlbumCell.classList.add('yellow');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
        
    }

    function displaySongNumber(guess, songNumberCell){

        var info;
        let guessTrackNumber;
        let encodedSongName = encodeURIComponent(guess);
        let url = `http://90.224.206.14:81/api/tracknumber?name=${encodedSongName}`

        let encodedTargetSongName = encodeURIComponent(targetSong);
        let url2 = `http://90.224.206.14:81/api/tracknumber?name=${encodedTargetSongName}`

        fetch(url)
        .then(response => response.json())
        .then(data => {
            info = data;
            songNumberCell.textContent = info[0].tracknumber;
            guessTrackNumber = info[0].tracknumber;
            console.log(info)
            return fetch(url2);
        })
        .then(response => response.json())
        .then(data => {

            if(parseInt(guessTrackNumber, 10) < parseInt(data[0].tracknumber, 10)){
                songNumberCell.textContent = info[0].tracknumber +'   ↑';
            }else if (parseInt(guessTrackNumber, 10) > parseInt(data[0].tracknumber, 10)){
                songNumberCell.textContent = info[0].tracknumber +'   ↓';
            }

            if (guessTrackNumber === data[0].tracknumber){
                songNumberCell.classList.add('green');
            }
            else if (Math.abs(parseInt(guessTrackNumber, 10) - parseInt(data[0].tracknumber, 10)) < 3 ) {
                songNumberCell.classList.add('yellow');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function displaySongLength(guess, songLengthCell){

        var info;
        let guessLength;
        let encodedSongName = encodeURIComponent(guess);
        let url = `http://90.224.206.14:81/api/length?name=${encodedSongName}`

        let encodedTargetSongName = encodeURIComponent(targetSong);
        let url2 = `http://90.224.206.14:81/api/length?name=${encodedTargetSongName}`

        fetch(url)
        .then(response => response.json())
        .then(data => {
            info = data;
            songLengthCell.textContent = info[0].length;
            guessLength = info[0].length;
            return fetch(url2);
        })
        .then(response => response.json())
        .then(data => {

            
            if(convertTimeStringToSeconds(guessLength) < convertTimeStringToSeconds(data[0].length)){
                songLengthCell.textContent = info[0].length +'   ↑';
            }else if (convertTimeStringToSeconds(guessLength) > convertTimeStringToSeconds(data[0].length)){
                songLengthCell.textContent = info[0].length +'   ↓';
            }

            if (guessLength === data[0].length){
                songLengthCell.classList.add('green');
            }

            else if (Math.abs(convertTimeStringToSeconds(guessLength) - convertTimeStringToSeconds(data[0].length)) < 31){
                songLengthCell.classList.add('yellow');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function displaySongStreams(guess, songStreamsCell){

        var info;
        let guessStreams;
        let encodedSongName = encodeURIComponent(guess);
        let url = `http://90.224.206.14:81/api/streams?name=${encodedSongName}`

        let encodedTargetSongName = encodeURIComponent(targetSong);
        let url2 = `http://90.224.206.14:81/api/streams?name=${encodedTargetSongName}`

        fetch(url)
        .then(response => response.json())
        .then(data => {
            info = data;
            songStreamsCell.textContent = info[0].streams;
            guessStreams = info[0].streams;
            return fetch(url2);
        })
        .then(response => response.json())
        .then(data => {

            if(convertStreamsStringToSeconds(guessStreams) < convertStreamsStringToSeconds(data[0].streams)){
                songStreamsCell.textContent = info[0].streams +'   ↑';
            }else if (convertStreamsStringToSeconds(guessStreams) > convertStreamsStringToSeconds(data[0].streams)){
                songStreamsCell.textContent = info[0].streams +'   ↓';
            }

            if (guessStreams === data[0].streams){
                songStreamsCell.classList.add('green');
            }

            else if (Math.abs(convertStreamsStringToSeconds(guessStreams) - convertStreamsStringToSeconds(data[0].streams)) < 51){
                songStreamsCell.classList.add('yellow');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
        
    }

    function convertTimeStringToSeconds(timeString) {
        const parts = timeString.split(':');
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        return (minutes * 60) + seconds;
    }

    function convertStreamsStringToSeconds(streamsString) {
        for (let i = 0; i < streamsString.length; i++) {
            if (streamsString[i] === 'M') {
                streamsString = streamsString.substring(0, i) + streamsString.substring(i + 1);
            }
        }
        const streams = parseInt(streamsString, 10);
        return streams;
    }

    async function displayAttempt(guess, guessRow){
        
        if (!gameDiv.contains(attemptsDiv)) {
        gameDiv.appendChild(attemptsDiv);
        }

        const songNameCell = document.createElement('div');
        songNameCell.className = 'cell black';
        guessRow.appendChild(songNameCell);

        const songAlbumCell = document.createElement('div');
        songAlbumCell.className = 'cell black';
        guessRow.appendChild(songAlbumCell);

        const songNumberCell = document.createElement('div');
        songNumberCell.className = 'cell black';
        guessRow.appendChild(songNumberCell);

        const songLengthCell = document.createElement('div');
        songLengthCell.className = 'cell black';
        guessRow.appendChild(songLengthCell);

        const songStreamsCell = document.createElement('div');
        songStreamsCell.className = 'cell black';
        guessRow.appendChild(songStreamsCell);

        attemptsDiv.appendChild(guessRow);

        await displaySongName(guess, songNameCell);
        await displaySongAlbum(guess, songAlbumCell);
        await displaySongNumber(guess, songNumberCell);
        await displaySongLength(guess, songLengthCell);
        await displaySongStreams(guess, songStreamsCell);
        await new Promise(resolve => setTimeout(resolve, 100));
        attemptsDiv.lastElementChild.scrollIntoView(true);
    }

    async function checkInput(input){
        let encodedInput = encodeURIComponent(input);
        let url = `http://90.224.206.14:81/api/count?q=${encodedInput}`;

        try{
            const response = await fetch(url);
            const data = await response.json();

            console.log(data.count); 
            return data.count > 0;
        } catch (error) {
            console.error('Error during search:', error);
            return false;
        }

    }

    async function checkIfVictory(guess, targetSong){
        let guessData, targetData;

        try {
            let guessResponse = await fetch(`http://90.224.206.14:81/api/songdata?name=${encodeURIComponent(guess)}`);
            let guessResult = await guessResponse.json();
            guessData = guessResult[0];
    
            let targetResponse = await fetch(`http://90.224.206.14:81/api/songdata?name=${encodeURIComponent(targetSong)}`);
            let targetResult = await targetResponse.json();
            targetData = targetResult[0];
    

            if (guessData && targetData) {

                return guessData.name === targetData.name &&
                    guessData.album === targetData.album &&
                    guessData.length === targetData.length &&
                    guessData.tracknumber === targetData.tracknumber &&
                    guessData.streams === targetData.streams;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error fetching song data:', error);
            return false; // In case of error, return false
        }
    }

    const supportButton = document.getElementById('support-button');
    supportButton.addEventListener('click', function() {
        window.open('https://ko-fi.com/colewordle', '_blank');
    });
        
    function playGameOverSound(targetSong) {
        if (targetSong === '…Ready for It?') {
            targetSong = '...Ready For It';
        } else if (targetSong === 'So It Goes…') {
            targetSong = 'So It Goes…';
        } else if (targetSong === 'Question...?') {
            targetSong = 'Question...';
        }
        var gameOverSound = new Audio(`/resources/snippets/${targetSong}.mp3`); 
        gameOverSound.play();

            //...Ready For It.mp3 is not listed in the text file.
            //So It Goes….mp3 is not listed in the text file.
            //Question....mp3 is not listed in the text file.
    }


    //_____________________________________________________________________________________LOGIC FOR LOCAL STORAGE_____________________________________________________________________________________
    //_____________________________________________________________________________________LOGIC FOR LOCAL STORAGE_____________________________________________________________________________________
    //_____________________________________________________________________________________LOGIC FOR LOCAL STORAGE_____________________________________________________________________________________


    function checkGameStatus() {
        const gameState = localStorage.getItem('gameState');
        const lastPlayedTimestamp = localStorage.getItem('lastPlayed');
        var guesses = getGuesses();
        console.log("guesses from checkGameStatus", guesses);

        if(guesses.length > 0) {
            console.log("guesses length is greater than 0");
            guesses.forEach(element => {
                const guessRow = document.createElement('li');  
                guessRow.className = "matrix-row"; 
                console.log(element.songName);
                displayAttempt(element.songName, guessRow);
            });
        }

        if (gameState && lastPlayedTimestamp) {
            const lastPlayedDate = new Date(parseInt(lastPlayedTimestamp));
            const currentDate = new Date();

            // Check if the game was last played today
            if (lastPlayedDate.toDateString() === currentDate.toDateString()) {
                // The game was played today. Display the previous game state/result.
                gameOver = true;
                guesses = getGuesses();
                displayResult(gameState, guesses); // Implement this function to show the game result
            } else {
                // A new day, the user can play again. Clear previous state.
                localStorage.removeItem('gameState');
                localStorage.removeItem('lastPlayed');
                resetGuesses();
                gameOver = false;
                return;
                // game can start
            }
        } else {
            gameOver = false;
            return;
        }
    }

    function displayResult(gameState, guesses) {
        // Implement this function based on how you want to show results
        console.log('Displaying result:', gameState);
    }

    function getGuesses() {
        // Retrieve and parse the guesses from localStorage
        return JSON.parse(localStorage.getItem('guesses')) || [];
    }

    function getTheme() {
        // Retrieve and parse the guesses from localStorage
        return JSON.parse(localStorage.getItem('theme')) || [];
    }


    function resetGuesses() {
        localStorage.removeItem('guesses');
    }

    function completeReset() {
        localStorage.clear();
    }

    function saveGameState(gameState) {
        // Call this function with the game state when the game finishes
        const now = new Date();
        localStorage.setItem('gameState', gameState); // gameState should be a string
        localStorage.setItem('lastPlayed', now.getTime().toString());
    }

    function getGuesses() {
        // Retrieve and parse the guesses from localStorage
        return JSON.parse(localStorage.getItem('guesses')) || [];
    }

    function saveGuess(songName, guessNumber) {   //________________________________________________NEED TO FIX GUESSNUMBER
        // Retrieve existing guesses from localStorage, if any
        const guesses = JSON.parse(localStorage.getItem('guesses')) || [];
        
        // Add the new guess to the array
        guesses.push({ songName, guessNumber });
        
        // Save the updated guesses array back to localStorage
        localStorage.setItem('guesses', JSON.stringify(guesses));
    }
});