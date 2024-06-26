require('babel-register');
require('babel-polyfill');

module.exports = {
    networks:{
        development: {
            host:'127.0.0.1',
            port:'7545',
            network_id : '*' // Connect to any network
        }
    },
    contracts_directory: './src/contracts',
    contrats_build_directory:'./src/truffle_abis',
    compilers: {
        solc:{
            version: '^0.8.0',
            solc:{
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    }
}