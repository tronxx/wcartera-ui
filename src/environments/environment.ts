// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: '',
    appId: '',
    storageBucket: '',
    apiKey: '',
    authDomain: '',
    messagingSenderId: '',
    measurementId: '',
  },
  production: false,
  menu: [
    {
      icon: 'view_list',
      name: 'Clientes',
      url: 'clientes',
    },
    {
      icon: 'view_list',
      name: 'Facturación',
      url: 'facturacion',
    },
    {
      icon: 'view_list',
      name: 'Ventas',
      url: 'detalleventas',
    },
    {
      icon: 'payment',
      name: 'Polizas',
      url: 'polizas',
    },
    {
      icon: 'add_a_photo',
      name: 'Obtener firmas e imagenes Ine',
      url: 'imagenes',
    },

  ],
  primaryColor: "#F85A3E",
  secondaryColor: "#FF7733",
  thirdColor: "#E15634",
  fourthColor: "#E63B2E",
  fifthColor: "#E1E6E1",
  primaryText : "black",
  secondaryText : "#afafaf",
  mapboxPublic : "pk.eyJ1Ijoia2V2c2Jhc3RvIiwiYSI6ImNrYmI5dHQzaTAyYnEzNGw0eTZvdHM4Z2wifQ.i2Sne0hE9gG-4KsMd9x1rA"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
