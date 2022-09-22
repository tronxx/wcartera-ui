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
      icon: 'dashboard',
      name: 'Inicio',
      url: 'landing',
    },
    {
      icon: 'person',
      name: 'Perfil',
      url: 'user-profile',
    },
    {
      icon: 'content_paste',
      name: 'Tablas',
      url: 'table-list',
    },
    {
      icon: 'article',
      
      name: 'Tipografía',
      url: 'typography',
    },
    {
      icon: 'insert_emoticon',
      name: 'Iconos',
      url: 'icons',
    },
    {
      icon: 'map',
      name: 'Mapas',
      url: 'maps',
    },
    {
      icon: 'notifications_active',
      name: 'Notificaciones',
      url: 'notifications',
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
