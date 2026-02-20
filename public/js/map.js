
//  mapboxgl.accessToken =mapToken;
//     const map = new mapboxgl.Map({
//         container: 'map', // container ID
//         center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
//         zoom: 7 // starting zoom
//     });

    
//     // Create a default Marker and add it to the map.
//     const marker = new mapboxgl.Marker({color:"red"})
//         .setLngLat(listing.geometry.coordinates)
//         .setPopup(new mapboxgl.Popup({offset: 25})
//         .setHTML(`<b><h5>${listing.title}</h5></b> <p>Exact location provided after booking </p>`))
//         .addTo(map);

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    center: listing.geometry.coordinates,
    zoom: 7
});

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<b><h5>${listing.title}</h5></b>
                  <p>Exact location provided after booking</p>`)
    )
    .addTo(map);

const markerElement = marker.getElement();
const svg = markerElement.querySelector("svg");

// Hover → Hide SVG and show your image
markerElement.addEventListener("mouseenter", () => {
    svg.style.display = "none";
    markerElement.style.backgroundImage = "url('/assets/airbnb.png')";
    markerElement.style.backgroundSize = "cover";
    markerElement.style.width = "40px";
    markerElement.style.height = "40px";
});

// Leave → Show SVG again
markerElement.addEventListener("mouseleave", () => {
    svg.style.display = "block";
    markerElement.style.backgroundImage = "";
    markerElement.style.width = "";
    markerElement.style.height = "";
});
