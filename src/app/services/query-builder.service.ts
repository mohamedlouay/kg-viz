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

  buildQuery_avgRainQtyPerStation(start: string, end: string) {
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
            PREFIX sosa: <http://www.w3.org/ns/sosa/>

SELECT distinct ?Nstation as ?StationName (SUM(?rainfall24h)) as ?rain ?insee ?latitude ?long WHERE
    {
        VALUES ?year  {"2021"^^xsd:gYear}
        VALUES ?start {'`+start+`'}
        VALUES ?end {'`+end+`'}
        ?s  a qb:Slice ;
        wes-dimension:station ?station ;
        wes-dimension:year ?year ;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:rainfall24h ?rainfall24h ].

        ?station a weo:WeatherStation ; dct:spatial ?e; rdfs:label ?Nstation.
        ?e wdt:P131 ?item .

        ?item rdfs:label ?StationName ; wdt:P2585  ?insee .
?station geo:lat ?latitude .
?station geo:long ?long.
FILTER (?Nstation != "ST-PIERRE" && ?Nstation !="NOUVELLE AMSTERDAM" && ?Nstation !="TROMELIN" && ?Nstation !="KERGUELEN"
&& ?Nstation !="EUROPA" && ?Nstation !="PAMANDZI" && ?Nstation !="GLORIEUSES" && ?Nstation !="GILLOT-AEROPORT" && ?Nstation !="ST-BARTHELEMY METEO"
&& ?Nstation !="LE RAIZET AERO" && ?Nstation !="LA DESIRADE METEO" && ?Nstation !="TRINITE-CARAVEL" && ?Nstation !="LAMENTIN-AERO"
&& ?Nstation !="SAINT LAURENT" && ?Nstation !="JUAN DE NOVA" && ?Nstation !="CAYENNE-MATOURY" && ?Nstation !="SAINT GEORGES" && ?Nstation !="MARIPASOULA" && ?Nstation !="DUMONT D'URVILLE")
    FILTER(?date >= xsd:date(?start))
    FILTER(?date < xsd:date(?end))
    }

    GROUP BY ?Nstation ?StationName ?insee ?long ?latitude
    ORDER BY ?Nstation
    `;
    return query;
  }

  getAvgRainRegion(start: string, end: string){
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
    PREFIX sosa: <http://www.w3.org/ns/sosa/>

    SELECT distinct (SUM(?rainfall24h)/COUNT(?Nstation)) as ?rain ?label  WHERE
    {
      VALUES ?year  {"2021"^^xsd:gYear}
  VALUES ?start {'`+start+`'}
        VALUES ?end {'`+end+`'}
        ?s  a qb:Slice ;
      wes-dimension:station ?station ;
      wes-dimension:year ?year ;
      qb:observation [
        a qb:Observation ;
      wes-attribute:observationDate ?date ;
      wes-measure:rainfall24h ?rainfall24h ].

        ?station a weo:WeatherStation ; dct:spatial ?e; rdfs:label ?Nstation.
      ?e wdt:P131 ?item .
      ?item rdfs:label ?label ; wdt:P2585  ?insee .
      ?station geo:lat ?latitude .
      ?station geo:long ?long.
      FILTER (?label != "ST-PIERRE" && ?label !="NOUVELLE AMSTERDAM" && ?label !="TROMELIN" && ?label !="KERGUELEN"
      && ?label !="EUROPA" && ?label !="PAMANDZI" && ?label !="GLORIEUSES" && ?label !="GILLOT-AEROPORT" && ?label !="ST-BARTHELEMY METEO"
      && ?label !="LE RAIZET AERO" && ?label !="LA DESIRADE METEO" && ?label !="TRINITE-CARAVEL" && ?label !="LAMENTIN-AERO"
      && ?label !="SAINT LAURENT" && ?label !="LA GUYANNE"&& ?label !="CAYENNE-MATOURY" && ?label !="SAINT GEORGES" && ?label !="MARIPASOULA" && ?label !="DUMONT D'URVILLE")
      FILTER(?date >= xsd:date(?start))
      FILTER(?date < xsd:date(?end))
    }

    GROUP BY ?label
      ORDER BY ?label `;
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

    SELECT distinct ?date ?Nstation ?temp_avg ?StationName ?insee WHERE
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
        ?item rdfs:label ?StationName ; wdt:P2585  ?insee .
        #BIND(month(?date) as ?month)
    }
    GROUP BY ?date ?Nstation ?StationName
    ORDER BY ?date
    `;
    return query;
  }

  buildQuery_getAllStationsAvgTemp(start: string, end: string) {
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
  PREFIX wep: <http://ns.inria.fr/meteo/ontology/property/>

SELECT ?insee ?StationName ?station ?latitude ?long (AVG(?temp_avg) as ?temp_avg)   WHERE {
   VALUES ?start {'`+start+`'}
        VALUES ?end {'`+end+`'}
      ?s a qb:Slice ; wes-dimension:station ?station;
          qb:observation [
              a qb:Observation ;
              wes-attribute:observationDate ?date ;
             wes-measure:avgDailyTemperature ?temp_avg
          ] .
      ?station a weo:WeatherStation ; dct:spatial ?e ; rdfs:label ?StationName.

?station geo:lat ?latitude .
?station geo:long ?long.
FILTER (?StationName != "ST-PIERRE" && ?StationName !="NOUVELLE AMSTERDAM" && ?StationName !="TROMELIN" && ?StationName !="KERGUELEN"
&& ?StationName !="EUROPA" && ?StationName !="PAMANDZI" && ?StationName !="GLORIEUSES" && ?StationName !="GILLOT-AEROPORT" && ?StationName !="ST-BARTHELEMY METEO"
&& ?StationName !="LE RAIZET AERO" && ?StationName !="LA DESIRADE METEO" && ?StationName !="TRINITE-CARAVEL" && ?StationName !="LAMENTIN-AERO"
&& ?StationName !="SAINT LAURENT" && ?StationName !="JUAN DE NOVA" && ?StationName !="CAYENNE-MATOURY" && ?StationName !="SAINT GEORGES" && ?StationName !="MARIPASOULA" && ?StationName !="DUMONT D'URVILLE")

FILTER (?date <= xsd:date(?end))
      }

  GROUP BY ?StationName ?insee ?station ?latitude ?long
ORDER BY ?temp_avg`;
    return query;
  }

  /*
  PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
            PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX qb:  <http://purl.org/linked-data/cube#>
            PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
            PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
            PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX dct: <http://purl.org/dc/terms/>
            PREFIX wdt: <http://www.wikidata.org/prop/direct/>
            PREFIX sosa: <http://www.w3.org/ns/sosa/>

SELECT distinct ?Nstation (SUM(?rainfall24h) as ?rainfall) ?label ?insee ?latitude ?long WHERE
    {
        VALUES ?year  {"2022"^^xsd:gYear}
        VALUES ?start {'2022-01-01'}
        VALUES ?end {'2022-06-01'}
        ?s  a qb:Slice ;
        wes-dimension:station ?station ;
        wes-dimension:year ?year ;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:rainfall24h ?rainfall24h ].

        ?station a weo:WeatherStation ; dct:spatial ?e; rdfs:label ?Nstation.
        ?e wdt:P131 ?item .

        ?item rdfs:label ?label ; wdt:P2585  ?insee .
?station geo:lat ?latitude .
?station geo:long ?long.
FILTER (?label != "ST-PIERRE" && ?label !="NOUVELLE AMSTERDAM" && ?label !="TROMELIN" && ?label !="KERGUELEN"
&& ?label !="EUROPA" && ?label !="PAMANDZI" && ?label !="GLORIEUSES" && ?label !="GILLOT-AEROPORT" && ?label !="ST-BARTHELEMY METEO"
&& ?label !="LE RAIZET AERO" && ?label !="LA DESIRADE METEO" && ?label !="TRINITE-CARAVEL" && ?label !="LAMENTIN-AERO"
&& ?label !="SAINT LAURENT" && ?label !="CAYENNE-MATOURY" && ?label !="SAINT GEORGES" && ?label !="MARIPASOULA" && ?label !="DUMONT D'URVILLE")
    FILTER(?date >= xsd:date(?start))
    FILTER(?date < xsd:date(?end))
    }
GROUP BY  ?Nstation ?label ?insee ?latitude ?long
ORDER BY ?Nstation
   */

  buildQuery_getAllStationsAvgWindSpeed() {
    var query = `PREFIX sosa: <http://www.w3.org/ns/sosa/>
PREFIX qudt: <http://qudt.org/schema/qudt/>
PREFIX wep: <http://ns.inria.fr/meteo/ontology/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sosa: <http://www.w3.org/ns/sosa/>
PREFIX qudt: <http://qudt.org/schema/qudt/>
PREFIX wep: <http://ns.inria.fr/meteo/ontology/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wd:   <http://www.wikidata.org/entity/>
prefix weo:  <http://ns.inria.fr/meteo/ontology/>
prefix wevf: <http://ns.inria.fr/meteo/vocab/meteorologicalfeature/>
prefix wevp: <http://ns.inria.fr/meteo/vocab/weatherproperty/>
select  ?stationID ?StationName AVG(?speed) AS ?speed  ?latitude ?long where
{
  ?obs a  weo:MeteorologicalObservation;
sosa:observedProperty
              wevp:windAverageSpeed ;
sosa:hasSimpleResult ?speed;
wep:madeByStation ?station ;
sosa:resultTime ?time .
?station geo:lat ?latitude .
?station geo:long ?long.
      ?station rdfs:label ?StationName ;
           weo:stationID ?stationID ;
           rdfs:label ?label .

FILTER (?label != "ST-PIERRE" && ?label !="NOUVELLE AMSTERDAM" && ?label !="TROMELIN" && ?label !="KERGUELEN"
&& ?label !="EUROPA" && ?label !="PAMANDZI" && ?label !="GLORIEUSES" && ?label !="GILLOT-AEROPORT" && ?label !="ST-BARTHELEMY METEO"
&& ?label !="LE RAIZET AERO" && ?label !="LA DESIRADE METEO" && ?label !="TRINITE-CARAVEL" && ?label !="LAMENTIN-AERO"
&& ?label !="SAINT LAURENT" && ?label !="CAYENNE-MATOURY" && ?label !="SAINT GEORGES" && ?label !="MARIPASOULA" && ?label !="DUMONT D'URVILLE")
FILTER(?time>= xsd:date("2021-01-01"))
FILTER(?time < xsd:date("2021-12-31"))
}
GROUP BY ?stationID ?StationName ?latitude ?long
ORDER BY ?stationID`
    return query;
  }

  buildQuery_getAllStationsAvgWindDirection() {
    var query = `PREFIX sosa: <http://www.w3.org/ns/sosa/>
    PREFIX qudt: <http://qudt.org/schema/qudt/>
    PREFIX wep: <http://ns.inria.fr/meteo/ontology/property/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX sosa: <http://www.w3.org/ns/sosa/>
    PREFIX qudt: <http://qudt.org/schema/qudt/>
    PREFIX wep: <http://ns.inria.fr/meteo/ontology/property/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX wd:   <http://www.wikidata.org/entity/>
    prefix weo:  <http://ns.inria.fr/meteo/ontology/>
    prefix wevf: <http://ns.inria.fr/meteo/vocab/meteorologicalfeature/>
    prefix wevp: <http://ns.inria.fr/meteo/vocab/weatherproperty/>
    select  ?stationID ?StationName  AVG(?angle) AS ?angle where
      {
        ?obs a  weo:MeteorologicalObservation;
    sosa:observedProperty
    wevp:windAverageDirection;
    sosa:hasSimpleResult ?angle;
    wep:madeByStation ?station ;
    sosa:resultTime ?time .
      ?station rdfs:label ?StationName ;
           weo:stationID ?stationID ;
           rdfs:label ?label .

    FILTER (?label != "Guyane"@fr && ?label !="Mayotte"@fr && ?label !="La Réunion"@fr && ?label !="Martinique"@fr && ?label !="Guadeloupe"@fr)
      FILTER(?time>= xsd:date("2021-01-01"))
      FILTER(?time < xsd:date("2021-12-31"))
  }
GROUP BY ?stationID ?StationName
ORDER BY ?stationID`
    return query;
  }

  /*
  PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
            PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX qb:  <http://purl.org/linked-data/cube#>
            PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
            PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
            PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX dct: <http://purl.org/dc/terms/>
            PREFIX wdt: <http://www.wikidata.org/prop/direct/>
            PREFIX sosa: <http://www.w3.org/ns/sosa/>

SELECT distinct (SUM(?rainfall24h)) as ?rain ?label  WHERE
    {
        VALUES ?year  {"2021"^^xsd:gYear}
        VALUES ?start {'2021-01-01'}
        VALUES ?end {'2021-12-31'}
        ?s  a qb:Slice ;
        wes-dimension:station ?station ;
        wes-dimension:year ?year ;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:rainfall24h ?rainfall24h ].

        ?station a weo:WeatherStation ; dct:spatial ?e; rdfs:label ?Nstation.
        ?e wdt:P131 ?item .
        ?item rdfs:label ?label ; wdt:P2585  ?insee .
?station geo:lat ?latitude .
?station geo:long ?long.
FILTER (?label != "ST-PIERRE" && ?label !="NOUVELLE AMSTERDAM" && ?label !="TROMELIN" && ?label !="KERGUELEN"
&& ?label !="EUROPA" && ?label !="PAMANDZI" && ?label !="GLORIEUSES" && ?label !="GILLOT-AEROPORT" && ?label !="ST-BARTHELEMY METEO"
&& ?label !="LE RAIZET AERO" && ?label !="LA DESIRADE METEO" && ?label !="TRINITE-CARAVEL" && ?label !="LAMENTIN-AERO"
&& ?label !="SAINT LAURENT" && ?label !="CAYENNE-MATOURY" && ?label !="SAINT GEORGES" && ?label !="MARIPASOULA" && ?label !="DUMONT D'URVILLE")
    FILTER(?date >= xsd:date(?start))
    FILTER(?date < xsd:date(?end))
    }

    GROUP BY ?label
    ORDER BY ?label
   */
  buildQuery_getAllStationsAvgHumidity() {
    var query = `PREFIX sosa: <http://www.w3.org/ns/sosa/>
PREFIX qudt: <http://qudt.org/schema/qudt/>
PREFIX wep: <http://ns.inria.fr/meteo/ontology/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sosa: <http://www.w3.org/ns/sosa/>
PREFIX qudt: <http://qudt.org/schema/qudt/>
PREFIX wep: <http://ns.inria.fr/meteo/ontology/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wd:   <http://www.wikidata.org/entity/>
prefix weo:  <http://ns.inria.fr/meteo/ontology/>
prefix wevf: <http://ns.inria.fr/meteo/vocab/meteorologicalfeature/>
prefix wevp: <http://ns.inria.fr/meteo/vocab/weatherproperty/>
select  ?stationID ?StationName  AVG(?humidity) AS ?humidity ?latitude ?long where
{
  ?obs a  weo:MeteorologicalObservation;
sosa:observedProperty
              wevp:airRelativeHumidity ;
sosa:hasSimpleResult ?humidity;
wep:madeByStation ?station ;
sosa:resultTime ?time .
?station geo:lat ?latitude .
?station geo:long ?long.
      ?station rdfs:label ?StationName ;
           weo:stationID ?stationID ;
           rdfs:label ?label .
FILTER (?label != "Guyane"@fr && ?label !="Mayotte"@fr && ?label !="La Réunion"@fr && ?label !="Martinique"@fr && ?label !="Guadeloupe"@fr)
?station rdfs:label ?StationName ; weo:stationID ?stationID .
FILTER (?label != "ST-PIERRE" && ?label !="NOUVELLE AMSTERDAM" && ?label !="TROMELIN" && ?label !="KERGUELEN"
&& ?label !="EUROPA" && ?label !="PAMANDZI" && ?label !="GLORIEUSES" && ?label !="GILLOT-AEROPORT" && ?label !="ST-BARTHELEMY METEO"
&& ?label !="LE RAIZET AERO" && ?label !="LA DESIRADE METEO" && ?label !="TRINITE-CARAVEL" && ?label !="LAMENTIN-AERO"
&& ?label !="SAINT LAURENT" && ?label !="CAYENNE-MATOURY" && ?label !="SAINT GEORGES" && ?label !="MARIPASOULA" && ?label !="DUMONT D'URVILLE")
FILTER(?time>= xsd:date("2021-01-01"))
FILTER(?time < xsd:date("2021-12-31"))
}
GROUP BY ?stationID ?StationName ?latitude ?long
ORDER BY ?stationID`
    return query;
  }



  getAvgTempPerRegion(){
    let query = `
        PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX qb: <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>

    SELECT ?label (GROUP_CONCAT(DISTINCT ?insee; SEPARATOR=",") AS ?insee)  (AVG(?temp_avg) AS ?temp_avg) WHERE {
        ?s a qb:Slice ; wes-dimension:station ?station ;
      qb:observation [
        a qb:Observation ;
      wes-attribute:observationDate ?date ;
      wes-measure:avgDailyTemperature ?temp_avg
    ] .
        ?station a weo:WeatherStation ; dct:spatial ?e ; rdfs:label ?Nstation .
        ?e wdt:P131 ?item .
        ?item rdfs:label ?label ; wdt:P2585 ?insee .
        ?station geo:lat ?latitude .
        ?station geo:long ?long .
      FILTER (?label != "Guyane"@fr && ?label !="Mayotte"@fr && ?label !="La Réunion"@fr && ?label !="Martinique"@fr && ?label !="Guadeloupe"@fr)
        FILTER (?date >= xsd:date('2021-05-01'))
        FILTER (?date <= xsd:date('2022-05-30'))

    }
    GROUP BY ?label
      ORDER BY ?temp_avg`;
    return query;
  }



}
