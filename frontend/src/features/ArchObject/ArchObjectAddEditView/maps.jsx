import React, { useState, useEffect, useReducer } from "react";

import { observer } from "mobx-react";


class BaseView extends React.Component {

  constructor(props) {
    super(props);

    this.ymaps = window.ymaps;


    this.ymaps.ready(() => {
      this.myMap = new this.ymaps.Map("map", {
        center: [42.87, 74.60],
        zoom: 11,
        controls: ["fullscreenControl", "typeSelector"]
      }, {
        searchControlProvider: "yandex#map"
      });
      var searchControl = new this.ymaps.control.SearchControl({
        options: {
          fitMaxWidth: true,
          maxWidth: [660, 660, 660]
        }
      });
      this.myMap.controls.add(searchControl);

      searchControl.events.add("resultselect", (e) => {

        var searchRequestString = searchControl.getRequestString();
        // this.myMap.geoObjects.removeAll()
        var results = searchControl.getResultsArray();
        var selected = e.get("index");
        var point = results[selected].geometry.getCoordinates();
        this.props.onSetCoords(point[0], point[1]);
        // if (this.props.changeAddress) {
        //   this.props.changeAddress(searchRequestString)
        // }
        var index = e.get("index");
        searchControl.getResult(index).then((res) => {
          if (this.props.changeAddress) {
            this.props.changeAddress(res.properties._data.name);
          }
        });
      });


      // var mySearchControl = new this.ymaps.control.SearchControl({
      //   options: {
      //     // boundedBy: [[40.608, 72.683], [40.4134, 72.9070]],
      //     noPlacemark: true,
      //     provider: 'yandex#search',
      //     size: 'large',
      //     strictBounds: true,
      //   }
      // })

      this.myMap.events.add("click", (e) => {
        var coords = e.get("coords");
        console.log(this.myMap.controls);
        this.myMap.geoObjects.removeAll();
        this.props.onSetCoords(coords[0], coords[1]);
      });

      // Результаты поиска будем помещать в коллекцию.
      // var mySearchResults = new this.ymaps.GeoObjectCollection(null, {
      //   hintContentLayout: this.ymaps.templateLayoutFactory.createClass('$[properties.name]')
      // });
      // this.myMap.controls.add(mySearchControl);
      // this.myMap.geoObjects.add(mySearchResults);
      // // При клике по найденному объекту метка становится красной.
      // mySearchResults.events.add('click', function (e) {
      //   e.get('target').options.set('preset', 'islands#redIcon');
      // })
      // // Выбранный результат помещаем в коллекцию.
      // mySearchControl.events.add('resultselect', (e) => {
      //   var index = e.get('index');
      //   mySearchControl.getResult(index).then((res) => {
      //     mySearchResults.add(res);
      //     this.myMap.geoObjects.removeAll()
      //     if(this.props.changeAddress){
      //       this.props.changeAddress(res.properties._data.address)
      //     }
      //   });
      // }).add('submit', function () {
      //   mySearchResults.removeAll();
      // })
    });

  }

  componentDidUpdate() {
    if (!this.myMap || !this.props.coord) {
      return;
    }

    this.myMap.geoObjects.removeAll();
    var myPlacemark = new this.ymaps.GeoObject({
      geometry: {
        type: "Point",
        coordinates: this.props.coord
      }
    });
    this.myMap.geoObjects.add(myPlacemark);
  }

  render() {

    return (
      <>
        <div id="map" style={{ height: "450px", width: 'auto' }}></div>
      </>
    );
  }
}

export default BaseView;
