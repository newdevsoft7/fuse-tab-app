// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    hmr       : false,
    apiUrl: '',
    socketServerUrl: 'wss://staffconnect-app.herokuapp.com',
    clientId: 2,
    formconnectUrl: 'https://formconnect.net',
    // formconnectUrl: 'http://localhost:4300',
    // socketServerUrl: 'wss://67.225.138.133:8080'
    // apiUrl:   'http://localhost:8000/api',
    // socketServerUrl: 'ws://localhost:8080'
    // quizconnectUrl: 'http://localhost:4400'
    quizconnectUrl: 'https://quizconnect.net',
    showcaseconnectUrl: 'http://localhost:4300',
    stripeApiKey: 'pk_test_y9EgKnnUW9OOeQMCltC2i4Tl'
};
