// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'fastbits-e4bcd',
    appId: '1:139576086214:web:7a63100bc3e8a695c611c7',
    storageBucket: 'fastbits-e4bcd.appspot.com',
    apiKey: 'AIzaSyAUFiiP3hEaqZUF4LSMmFXasrm3gwf7dTs',
    authDomain: 'fastbits-e4bcd.firebaseapp.com',
    messagingSenderId: '139576086214',
    measurementId: 'G-V75HB6RVRT',
  },
  production: false,
  menu: [
    {
      icon: 'home',
      name: 'Inicio',
      url: 'landing',
    },
    {
      icon: 'supervisor_account',
      name: 'clientes',
      url: 'clients',
    },
    {
      icon: 'shopping_basket',
      name: 'productos',
      url: 'products',
    },
    {
      icon: 'receipt',
      name: 'facturas',
      url: 'invoices',
    },
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
