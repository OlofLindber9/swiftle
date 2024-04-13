function setKanyeTheme() {
    var themeStyle = document.getElementById('theme-style');
    themeStyle.setAttribute('href', '/css/styleKanye.css');
    console.log('here is an easter egg for you :)');
}
export { setKanyeTheme };

document.addEventListener('initComplete', (event) => {
    
    document.getElementById('theme-1989').addEventListener('click', function() {
        var themeStyle = document.getElementById('theme-style');
        themeStyle.setAttribute('href', '/css/style1989.css');
        saveTheme('1989');
        console.log('1989 theme selected');
    });

    document.getElementById('theme-Lover').addEventListener('click', function() {
        var themeStyle = document.getElementById('theme-style');
        themeStyle.setAttribute('href', '/css/styleLover.css');
        saveTheme('Lover');
        console.log('Lover theme selected');
    });

    document.getElementById('theme-Reputation').addEventListener('click', function() {
        var themeStyle = document.getElementById('theme-style');
        themeStyle.setAttribute('href', '/css/styleReputation.css');
        saveTheme('Reputation');
        console.log('Reputation theme selected');
    });

    function saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }
});