const update = document.querySelector('#update-button');
const deleteButton = document.querySelector('#delete-button');
const messageDiv = document.querySelector("#message");

function replaceWithDarthVaderQuote() {
    fetch('/quotes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Yoda',
            quote: 'Do or do not, there is no try.',
        }),
    })
    .then(() => {
        window.location.reload(true);
    })
    .catch(error => console.error(error));
}

update.addEventListener('click', _ => {
    // Check if there is a Yoda quote
    fetch('/quotes?name=Yoda') // Send a GET request to check if Yoda's quote exists
        .then(res => {
            if (res.ok) {
                // Yoda quote exists, replace it with Darth Vader quote
                return replaceWithDarthVaderQuote();
            } else if (res.status === 404) {
                // Yoda quote doesn't exist, prompt the user to add one
                const userInput = prompt("If Yoda quote is present, simply press enter. Otherwise, there is no Yoda quote to be found, generate one and it will immediately be converted to a Darth Vader Quote. Please enter a Yoda quote:");
                if (userInput) {
                    return fetch('/quotes', {
                        method: 'post',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: 'Yoda',
                            quote: userInput,
                        }),
                    });
                }
            }
        })
        .then(() => {
            // Now that either Yoda quote is replaced with Darth Vader quote
            // or a new Yoda quote is added, add a Darth Vader quote
            return fetch('/quotes', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Darth Vader',
                    quote: 'I find your lack of faith disturbing.',
                }),
            });
        })
        .then(() => {
            window.location.reload(true);
        })
        .catch(error => console.error(error));
});

deleteButton.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Darth Vader'
        })
    })
        .then(res => {
            if (res.ok) return res.json();
            // If quote doesn't exist, display a message to the user
            else if (res.status === 404) {
                messageDiv.textContent = 'No Darth Vader quote to delete. Please generate one or replace a Yoda quote.';
                throw new Error('No Darth Vader quote to delete');
            }
        })
        .then(response => {
            if (response.message === 'No quote to delete') {
                messageDiv.textContent = 'No Darth Vader quote to delete. Please generate one or replace a Yoda quote.';
            } else {
                window.location.reload(true);
            }
        })
        .catch(error => console.error(error));
});

// Function to handle editing a quote
function handleEditQuote(index) {
    const quoteBox = document.querySelectorAll('.quote')[index];
    const quoteTextElement = quoteBox.querySelector('span:nth-child(2)');
    const quoteAuthorElement = quoteBox.querySelector('span:nth-child(1)');
    const quoteText = quoteTextElement.textContent;
    const quoteAuthor = quoteAuthorElement.textContent;

    const newQuoteText = prompt("Edit the quote:", quoteText);
    if (newQuoteText !== null && newQuoteText.trim() !== "") {
        fetch('/quotes', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: quoteAuthor,
                quote: newQuoteText,
            }),
        })
        .then(res => {
            if (res.ok) {
                quoteTextElement.textContent = newQuoteText;
            } else {
                throw new Error('Failed to update quote');
            }
        })
        .catch(error => console.error(error));
    }
}

// Function to handle deleting a quote
function handleDeleteQuote(index) {
    const quoteBox = document.querySelectorAll('.quote')[index];
    const quoteAuthorElement = quoteBox.querySelector('span:nth-child(1)');
    const quoteAuthor = quoteAuthorElement.textContent;

    const shouldDelete = confirm("Are you sure you want to delete this quote?");
    if (shouldDelete) {
        fetch('/quotes', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: quoteAuthor,
            }),
        })
        .then(res => {
            if (res.ok) {
                quoteBox.remove(); // Remove the quote box from the page
            } else {
                throw new Error('Failed to delete quote');
            }
        })
        .catch(error => console.error(error));
    }
}

// Get all the edit buttons and add event listeners
const editButtons = document.querySelectorAll('.edit-button');

editButtons.forEach((editButton, index) => {
    editButton.addEventListener('click', () => handleEditQuote(index));
});

// Get all the delete buttons and add event listeners
const deleteButtons = document.querySelectorAll('.delete-button');

deleteButtons.forEach((deleteButton, index) => {
    deleteButton.addEventListener('click', () => handleDeleteQuote(index));
});
// Add the light/dark mode toggle functionality
const toggleModeButton = document.querySelector('#toggle-mode-button');
toggleModeButton.addEventListener('click', () => {
    const body = document.body;
    if (body.classList.contains('dark-side')) {
        body.classList.remove('dark-side');
        toggleModeButton.textContent = 'Dark Side';
    } else {
        body.classList.add('dark-side');
        toggleModeButton.textContent = 'Light Side';
    }
});
