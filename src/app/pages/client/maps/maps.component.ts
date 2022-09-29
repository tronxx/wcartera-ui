import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  
  map: mapboxgl.Map;

  constructor() { }

  ngOnInit(): void {

    (mapboxgl as any).accessToken = environment.mapboxPublic;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-80.24879104052215, 26.03371948592011],
      zoom: 16,
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.createMarker();
  }

  createMarker(){
    const marker = new mapboxgl.Marker({draggable: true})
    .setLngLat([-80.24879104052215, 26.03371948592011])
    .addTo(this.map);
  }

}
