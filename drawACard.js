var deck;

function updateCardFace ( face, suit, value ) {
    document.getElementById("face").src = face;
    document.getElementById("suit").innerHTML = suit;
    document.getElementById("value").innerHTML = value;    
}

// Make an HTTP GET Request to an API, parse the JSON response, and return a Javascrip object
async function makeAPIRequest(requestURL) {

    let response = await fetch(requestURL);

    if (response.ok) { // if HTTP-status is 200-299

        // Return the parsed JavaScript Object from the JSON data
        return response.json();

    } else {
        console.error("HTTP Error" + response.statusText)
        alert("HTTP-Error: " + response.status);
    }
}

// Gets URL Parameters for a Specific Card
function getCardFromURLParameters(queryString) {

    console.log("All URL Parameters: " + queryString);

    // Parse URL into individual parameters
    // Example: http://mysite.com?card=5C
    const urlParams = new URLSearchParams(queryString);


    //If a card is defined in the URL parameters create a string
    var cardDefined = urlParams.get('card')
    console.log("cardDefined: " + cardDefined);

    // If a 'card' parameter is in the URL, the cardDefined variable now contains a card object
    console.log("card defined in parameters");

    // Update HTML to show Face of Specified Card
    document.getElementById("face").src = "https://deckofcardsapi.com/static/img/" + cardDefined + ".png";
    document.getElementById("suit").innerHTML = "Card Defined In URL Parameter";

}

// Get a Deck of Cards from an API
function getDeck() {
    console.log("getting deck");

    // Make a Request to the API then handle the response
    makeAPIRequest('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(response => {
        // Save the response into a JavaScript Variable so that we can use it
        deck = response;
        console.log(deck);

        // Update HTML with information about the New Deck
        document.getElementById("deckID").innerHTML = deck.deck_id;
        document.getElementById("cardsRemaining").innerHTML = deck.remaining;

        // Reset Card Face To Fresh Deck
        updateCardFace( "https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-1_1024x1024.png?v=1535755695", null, "A Fresh Deck" );

        // Return the Deck
        return deck;
    })
}

// Get a Card from a Specific Deck of Cards
function drawCard(deckID) {

    console.log("drawing card");

    // Make a Request to the API then handle the response
    makeAPIRequest('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1').then(response => {

        // Save the response into a JavaScript Variable so that we can use it
        deck = response;

        // Get first element in Card Array
        var card = deck.cards[0];
        console.log(card);

        // Update HTML to display the new card
        updateCardFace( card.image, card.suit, card.value );

        // Update HTML to display correct number of cards left in deck
        document.getElementById("cardsRemaining").innerHTML = deck.remaining;


    })
}



// Main -- the code below will be executed when Page loads

// Get URL Parameters if they exist
const queryString = window.location.search;

if (queryString) {

    // If there are URL Parameters, dissect the parameters and get the specified card image
    getCardFromURLParameters(queryString);

} else {

    // Otherwise, we get a deck from an API
    console.log("No URL Parameters detected");
    deck = getDeck();

    // Automatically Draw a Card from the Deck
    // drawCard(deck.deck_id);
}
