document.addEventListener('initComplete', (event) => {
    
    document.getElementById('theme-1989').addEventListener('click', function() {
        var themeStyle = document.getElementById('theme-style');
        themeStyle.setAttribute('href', '/css/style1989.css');
        console.log('1989 theme selected');
    });

    document.getElementById('theme-Lover').addEventListener('click', function() {
        var themeStyle = document.getElementById('theme-style');
        themeStyle.setAttribute('href', '/css/styleLover.css');
        console.log('Lover theme selected');
    });

    document.getElementById('theme-Reputation').addEventListener('click', function() {
        var themeStyle = document.getElementById('theme-style');
        themeStyle.setAttribute('href', '/css/styleReputation.css');
        console.log('Reputation theme selected');
    });
});