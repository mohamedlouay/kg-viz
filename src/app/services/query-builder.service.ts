import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QueryBuilderService {
  constructor() {}
  buildQuery_stations(insee: string) {
    let queryStations =
      `
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX geosparql:  <http://www.opengis.net/ont/geosparql#>
    SELECT distinct * WHERE {
        ?station rdfs:label ?stationName; dct:spatial [ wdt:P131 [rdfs:label ?label ; wdt:P2585 '` +
      insee +
      `']];  geo:lat ?lat; geo:long ?long .
    }
    `;
    return queryStations;
  }
  QueryObservationsByDate(insee: number, date: string) {
    let query =
      `
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX sosa: <http://www.w3.org/ns/sosa/>
    PREFIX wep: <http://ns.inria.fr/meteo/ontology/property/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX wevp: <http://ns.inria.fr/meteo/vocab/weatherproperty/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>

    SELECT  distinct ?t  ((?v - 273.15) as ?temp) ?station ?region WHERE
    {
        VALUES ?insee { '` +
      insee +
      `'}
        VALUES ?date { "` +
      date +
      `"}
        ?obs a  weo:MeteorologicalObservation;
        sosa:observedProperty wevp:airTemperature ;
        sosa:hasSimpleResult  ?v;
        wep:madeByStation ?s ;
        sosa:resultTime ?t .
        ?s rdfs:label ?station .
        ?s a weo:WeatherStation ; dct:spatial ?e.
        ?e wdt:P131 ?item .
        ?item rdfs:label ?region ;  wdt:P2585  ?insee .

        #FILTER(xsd:date(?t) <= xsd:date(?date))
        FILTER(xsd:date(?t) >= xsd:date(?jourPrecedent))
        BIND ( bif:dateadd('day', -1, xsd:date(?date)) as ?jourPrecedent)
        BIND ( bif:dateadd('day', 1, xsd:date(?date)) as ?jourSuivant)
        FILTER(xsd:date(?t) <= ?jourSuivant)

    }
    ORDER BY ?t

    `;
    return query;
  }
  buildQuery_slices(insee: number) {
    let query =
      `PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
            PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX qb:  <http://purl.org/linked-data/cube#>
            PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
            PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
            PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX dct: <http://purl.org/dc/terms/>
            PREFIX wdt: <http://www.wikidata.org/prop/direct/>

    SELECT distinct ?date ?Nstation ?temp_avg ?label ?insee WHERE
    {
        VALUES ?insee  {'` +
      insee +
      `' }
        VALUES ?year  {"2021"^^xsd:gYear}
        ?s  a qb:Slice ;
        wes-dimension:station ?station ;
        wes-dimension:year ?year ;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:avgDailyTemperature ?temp_avg; wes-measure:rainfall24h ?rainfall24h] .

        ?station a weo:WeatherStation ; dct:spatial ?e; rdfs:label ?Nstation.
        ?e wdt:P131 ?item .
        ?item rdfs:label ?label ; wdt:P2585  ?insee .
        #BIND(month(?date) as ?month)
    }
    GROUP BY ?date ?Nstation ?label
    ORDER BY ?date
    `;
    return query;
  }

  buildQuery_getAllStationsAvgTemp() {
    var query = `PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
  PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX qb:  <http://purl.org/linked-data/cube#>
  PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
  PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
  PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>

SELECT ?insee ?label ?station ?latitude ?long (AVG(?temp_avg) as ?temp_avg)   WHERE {
      ?s a qb:Slice ; wes-dimension:station ?station;
          qb:observation [
              a qb:Observation ;
              wes-attribute:observationDate ?date ;
             wes-measure:avgDailyTemperature ?temp_avg
          ] .
      ?station a weo:WeatherStation ; dct:spatial ?e ; rdfs:label ?Nstation.
      ?e wdt:P131 ?item .
      ?item rdfs:label ?label ; wdt:P2585 ?insee.
?station geo:lat ?latitude .
?station geo:long ?long.
    FILTER (?date >= xsd:date('2022-05-01'))
   FILTER (?date <= xsd:date('2022-05-30'))
      }

  GROUP BY ?label ?insee ?station ?latitude ?long
ORDER BY ?temp_avg`;
    return query;
  }
}
