// JavaScript-functie voor het versturen van het formulier
function handleFormSubmission(event) {
    event.preventDefault(); // Voorkom standaardgedrag van formulierindiening

    // Laat een bericht zien dat het formulier wordt geladen
    document.querySelector(".loading-message").classList.add("show");

    // Simuleer het verzenden van het formulier (hier kun je je eigen logica gebruiken)
    setTimeout(function () {
        var success = Math.random() < 0.5; // Willekeurig succes of fout (50% kans)
        if (success) {
            // Als het formulier is verzonden, verwijder het laadbericht en toon een succesbericht
            document.querySelector(".loading-message").classList.remove("show");
            document.querySelector(".success-message").classList.add("show");
            
            // Na een korte vertraging (bijvoorbeeld 2 seconden), naar een andere pagina
            setTimeout(function() {
                window.location.href = "/success"; 
            }, 2000);
        } else {
            // Als het verzenden mislukt, verwijder het laadbericht en toon een foutbericht
            document.querySelector(".loading-message").classList.remove("show");
            document.querySelector(".error-message").classList.add("show");
        }
    }, 2000); // Simuleer een vertraging van 2 seconden voor het verzenden van het formulier
}

// nog niet af paar stappen missen nog// ik weet niet echt wat het plan hiervan was..