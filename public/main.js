// Function to like an item via API request
async function likeItem(itemId) {
  try {
    const response = await fetch('/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId }), // Send item ID in the request body
    });

    if (!response.ok) {
      throw new Error('Failed to like the item');
    }

    const data = await response.json();
    const likeCountSpan = document.getElementById(`like-count-${itemId}`);
    const likeButton = document.getElementById(`likeButton-${itemId}`);

    if (likeCountSpan && likeButton) {
      likeCountSpan.textContent = data.likes; // Update like count on the UI
      likeButton.textContent = '❤️ Liked'; // Change button text to 'Liked'
      likeButton.disabled = true; // Disable the button after liking
    }
  } catch (error) {
    console.error('Failed to like the item:', error);
  }
}

// Function to handle like button click
function handleLike(itemId) {
  const likeButton = document.getElementById(`likeButton-${itemId}`);
  if (likeButton) {
    likeButton.textContent = '⌛ Liking...'; // Change button text to loading state
    likeItem(itemId); // Call function to like the item via API
  } else {
    console.error('Like button not found for item:', itemId);
  }
}
