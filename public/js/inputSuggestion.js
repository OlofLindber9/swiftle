document.addEventListener('initComplete', (event) => {
    const input = document.getElementById('guess-input');
    const suggestionBox = document.getElementById('suggestion-box');
    input.parentNode.insertBefore(suggestionBox, input.nextSibling);

    let selectedIndex = -1;


    input.addEventListener('input', function() {
        const partialName = input.value;
        if (partialName === '') {
            suggestionBox.innerHTML = '';
            suggestionBox.style.display = 'none';
            return;
        }

        if (partialName.length < 2) {
            suggestionBox.innerHTML = '';
            suggestionBox.style.display = 'none';
            return;
        }
    
        let url = `https://swiftle.org/api/suggestions?partial=${encodeURIComponent(partialName)}`;
        fetch(url)
            .then(response => response.json())
            .then(suggestions => {
                if (suggestions.length > 0) {
                    suggestionBox.innerHTML = suggestions.map(name => `<div class="suggestion-item">${name}</div>`).join('');
                    suggestionBox.style.display = 'block';
    
                    // Add click event listeners to each suggestion item
                    document.querySelectorAll('.suggestion-item').forEach(item => {
                        item.addEventListener('click', function() {
                            input.value = this.textContent; // Set input value to the suggestion's text
                            suggestionBox.style.display = 'none'; // Hide the suggestion box
                        });
                    });
                    
                } else {
                    suggestionBox.innerHTML = '';
                    suggestionBox.style.display = 'none';
                }
            })
            .catch(error => console.error('Error:', error));
    });

    input.addEventListener('keyup', (e) => {
        const items = document.querySelectorAll('.suggestion-item');
        if (e.code === 'ArrowDown') {
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelected();
            e.preventDefault(); // Prevent the cursor from moving in the input field
        } else if (e.code === 'ArrowUp') {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelected();
            e.preventDefault();
        } else if (e.code === 'Enter' && selectedIndex >= 0) {
            input.value = items[selectedIndex].textContent;
            suggestionBox.style.display = 'none';
            selectedIndex = -1;
            e.preventDefault();
        }
    });
    

        // Hide suggestion box when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target.id !== 'guess-input' && e.target.id !== 'suggestion-box') {
                suggestionBox.style.display = 'none';
            }
        });

    function updateSelected() {
        document.querySelectorAll('.suggestion-item').forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' }); // Ensure the selected item is in the visible area
            } else {
                item.classList.remove('selected');
            }
        });
    }
});
