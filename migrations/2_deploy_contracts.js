const Cryptofaces = artifacts.require('Cryptofaces');

module.exports = (deployeer) => {
  deployeer.deploy(Cryptofaces);
};