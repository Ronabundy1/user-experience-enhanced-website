// 1. Opzetten van de webserver

// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'


// Maak een nieuwe express app aan
const app = express()

// Dit zorgt ervoor dat je JSON kunt ontvangen in POST requests
app.use(express.json());

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'));

// Route voor de hoofdpagina (GET)
app.get('/', function (request, response) {
  // Laat de index pagina zienS
  response.render("index");
});

// Route voor het ophalen van vraag en aanbod data
app.get('/vraagenaanbod', function (request, response) {
  // Haal vraag en aanbod data op van externe API
  fetchJson("https://fdnd-agency.directus.app/items/dh_services")
    .then((apiData) => {
      console.log(apiData);
      // Render de vraag-aanbod pagina met de opgehaalde data
      response.render('vraag-aanbod', { vraagaanbod: apiData.data });
    })
    .catch((error) => {
      // Toon een foutmelding als het ophalen van data mislukt
      console.error("Error fetching vraag en aanbod data:", error);
      response.status(500).send("Error fetching vraag en aanbod data. Please try again later.");
    });
});

// Routes voor specifieke pagina's
app.get('/about', function (request, response) {  
  // Laat de about pagina zien
  response.render('about')
});

app.get('/contact', function (request, response) {
  // Laat de contact pagina zien
  response.render('contact')
});

// Route voor het weergeven van het aanmeldformulier (GET)
app.get('/aanmelden', function (req, res) {
  // Render het aanmeldformulier
  res.render('aanmelden', { success: false, error: false, loading: false, empty: false });
});


app.get('/success', function (req, res) {
  // Render het aanmeldformulier
  res.render('success');
});

// post route voor het aanmeldformulier
app.post('/success', function (request, response) {

  response.render('success');
});

// Dynamische detail route
app.get('/detail/:itemId', function (request, response) {
  const itemId = request.params.itemId;
  console.log("Item ID:", itemId); // Log het itemId
  
  // Haal gedetailleerde informatie op over het specifieke item
  fetchJson(`https://fdnd-agency.directus.app/items/dh_services/${itemId}`)
    .then((apiData) => {
      const itemData = apiData.data;
      console.log("Item Data:", itemData); // Log de opgehaalde item data
      // Render de detail pagina met de opgehaalde item data
      response.render('detail', { itemId: itemId, itemData: itemData });
    })
    .catch((error) => {
      // Toon een foutmelding als het ophalen van data mislukt
      console.error("Error fetching item data:", error);
      response.status(500).send("Error fetching item data. Please try again later.");
    });
});

// Route om like verzoeken te verwerken
app.post('/like', async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log('Like verzoek ontvangen voor item met ID:', itemId);

    // Voer logica uit om likes voor het opgegeven item bij te werken
    const updatedLikes = await updateLikes(itemId);

    // Stuur het bijgewerkte aantal likes terug naar de client
    res.json({ likes: updatedLikes });
  } catch (error) {
    console.error('Fout bij verwerken van like actie:', error);
    res.status(500).json({ error: 'Verwerken van like actie is mislukt' });
  }
});

// Functie om het aantal likes voor het opgegeven item bij te werken
async function updateLikes(itemId) {
  try {
    // Haal het huidige aantal likes op voor het item vanuit je API of database
    const itemData = await fetchJson(`https://fdnd-agency.directus.app/items/dh_services/${itemId}`);
    const currentLikes = itemData.data.likes || 0; // Gebruik het bestaande aantal likes of standaard naar 0

    // Verhoog het aantal likes met 1
    const newLikes = currentLikes + 1;

    // Werk het aantal likes bij in de externe API of database
    const updateResponse = await fetch(`https://fdnd-agency.directus.app/items/dh_services/${itemId}`, {
      method: 'PATCH', // Gebruik PATCH-methode om specifieke velden bij te werken
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ likes: newLikes }), // Werk het likes-veld bij met de nieuwe waarde
    });

    if (!updateResponse.ok) {
      throw new Error('Kon het aantal likes niet bijwerken');
    }

    // Geef het bijgewerkte aantal likes terug
    return newLikes;
  } catch (error) {
    throw new Error(`Fout bij het bijwerken van het aantal likes: ${error.message}`);
  }
}


// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000);

// Start express op en luister naar het ingestelde poortnummer
app.listen(app.get('port'), function () {
  // Toon een bericht in de console met het gebruikte poortnummer
  console.log(`Application started on http://localhost:${app.get('port')}`);
});