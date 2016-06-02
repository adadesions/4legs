ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '1650232795264053',
    secret: 'b121f8fd0cdd123defe16f5050d55a9b',
    redirectUri: 'https://4kha.com/_oauth/facebook',
    loginStyle: "popup"
});

//Test App
// ServiceConfiguration.configurations.insert({
//     service: 'facebook',
//     appId: '1650233041930695',
//     secret: '30e0f9fb8f8971561dd5a8f229b749b4'
// });
