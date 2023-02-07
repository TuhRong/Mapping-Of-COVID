mapboxgl.accessToken =
            'pk.eyJ1IjoidHVocm9uZyIsImEiOiJjbGRzOWcxZm8wc216M29tczRubHoyeXY0In0.MZeb3zCRCCakYDKq4yDhnw';
        let map = new mapboxgl.Map({
            container: 'map',
            projection: 'albers', // container ID
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 4, // starting zoom
            center: [-98.5795, 39.8283] // starting center
        });
        const grades = [500, 1000, 5000, 10000, 20000, 50000, 100000, 300000],
            colors = ['rgb(255,247,251)', 'rgb(236,231,242)', 'rgb(208,209,230)', 'rgb(166,189,219)', 'rgb(116,169,207)', 'rgb(54,144,192)', 'rgb(5,112,176)', 'rgb(3,78,123)']
            radii = [1, 5, 10, 15, 20, 25, 30, 50];
        //load data to the map as new layers.
        //map.on('load', function loadingData() {
        map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
            // when loading a geojson, there are two steps
            // add a source of the data and then add the layer out of the source
            map.addSource('us-covid-2020-counts', {
                type: 'geojson',
                data: 'assets/us-covid-2020-counts.json'
            });
            map.addLayer({
                'id': 'covid-counts',
                'type': 'circle',
                'source': 'us-covid-2020-counts',
                'minzoom': 3,
                'paint': {
                    // increase the radii of the circle as COVID cases increases
                    'circle-radius': {
                        'property': 'cases',
                        'stops': [
                            [grades[0], radii[0]],
                            [grades[1], radii[1]],
                            [grades[2], radii[2]],
                            [grades[3], radii[3]],
                            [grades[4], radii[4]],
                            [grades[5], radii[5]],
                            [grades[6], radii[6]],
                            [grades[7], radii[7]]
                        ]
                    },
                    // increase the radii of the circle as COVID cases increases
                    'circle-color': {
                        'property': 'cases',
                        'stops': [
                            [grades[0], colors[0]],
                            [grades[1], colors[1]],
                            [grades[2], colors[2]],
                            [grades[3], colors[3]],
                            [grades[4], colors[4]],
                            [grades[5], colors[5]],
                            [grades[6], colors[6]],
                            [grades[7], colors[7]]
                        ]
                    },
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.6
                }
            });
// click on circle to view number of COVID cases
map.on('click', 'covid-counts', (event) => {
                new mapboxgl.Popup()
                    .setLngLat(event.features[0].geometry.coordinates)
                    .setHTML(`<strong>Cases:</strong> ${event.features[0].properties.cases}`)
                    .addTo(map);
            });
        });
        // create legend
        const legend = document.getElementById('legend');
        //set up legend grades and labels
        var labels = ['<strong>Number of Covid Cases</strong>'],
            vbreak;
        //iterate through grades and create a scaled circle and label for each
        for (var i = 0; i < grades.length; i++) {
            vbreak = grades[i];
            // you need to manually adjust the radius of each dot on the legend 
            // in order to make sure the legend can be properly referred to the dot on the map.
            dot_radii = 2 * radii[i];
            labels.push(
                '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
                'px; height: ' +
                dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
                '</span></p>');
        }
        // add the data source
        const source =
            '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times</a></p>';
        // combine all the html codes.
        legend.innerHTML = labels.join('') + source;