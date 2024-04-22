// 1. Opzetten van de webserver

// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'));

// Route voor de hoofdpagina (GET)
app.get('/', function (request, response) {
  // Laat de index pagina zien
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

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000);

// Start express op en luister naar het ingestelde poortnummer
app.listen(app.get('port'), function () {
  // Toon een bericht in de console met het gebruikte poortnummer
  console.log(`Application started on http://localhost:${app.get('port')}`);
});
