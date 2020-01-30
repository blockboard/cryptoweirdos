const CryptoFaces = artifacts.require('CryptoFaces');

module.exports = (deployer, network, accounts) => {

    let _cfAccount = accounts[0];

    console.log(`Running within network = ${network}`);
    console.log(`_cfAccount = ${_cfAccount}`);

   return deployer.deploy(CryptoFaces, {
       from: _cfAccount
   });
};