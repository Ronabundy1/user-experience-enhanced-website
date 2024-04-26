// Functie om een item leuk te vinden via een API-verzoek
async function likeItem(itemId) {
  try {
    // Stuur een bericht naar de server om het item leuk te vinden
    const response = await fetch('/like', {
      method: 'POST',  // Verzend het bericht als een 'POST'-verzoek
      headers: {
        'Content-Type': 'application/json',  // Gebruik JSON-indeling voor het bericht
      },
      body: JSON.stringify({ itemId }), // Stuur het item ID mee in het bericht
    });

    // Controleer of het verzoek succesvol was
    if (!response.ok) {
      throw new Error('Kon het item niet leuk vinden');
    }

    // Haal het aantal likes op dat terugkomt van de server
    const data = await response.json();

    // Update het aantal likes op de webpagina
    const likeCountSpan = document.getElementById(`like-count-${itemId}`);
    if (likeCountSpan) {
      likeCountSpan.textContent = data.likes; // Toon het nieuwe aantal likes
    } else {
      console.error('Kan het like-tellingselement niet vinden voor dit item:', itemId);
    }
  } catch (error) {
    console.error('Er is een fout opgetreden bij het leuk vinden van het item:', error);
  }
}

function handleLike(itemId) {
  const likeButton = document.getElementById('likeButton');
  likeButton.textContent = '⌛ Liking...'; // Verander de tekst naar een loading state

  // Simuleer een asynchrone like-actie (vervang dit met je eigen logica)
  setTimeout(() => {
      // Na een bepaalde vertraging, voltooi de like-actie
      const likeCountElement = document.getElementById(`like-count-${itemId}`);
      let currentLikes = parseInt(likeCountElement.textContent) || 0;
      currentLikes++;
      likeCountElement.textContent = currentLikes;

      likeButton.textContent = ' ❤️ Liked'; // Verander de tekst naar 'Liked'
      likeButton.disabled = true; 
  }, 1000); /*vertraag de like-actie met 1 seconde*/
}
