const Cryptofaces = artifacts.require("./contracts/CryptoFaces.sol");

require('chai')
    .use(require("chai-as-promised"))
    .should();

contract('Cryptofaces', (accounts) => {
    let contract;

    before(async () => {
        contract = await Cryptofaces.deployed();
    });

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = contract.address;
            console.log(address);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, 0x0);
            assert.notEqual(address, undefined);
        });

        it('should has a name', async () => {
           const name = await contract.name();
           assert.equal(name, 'Cryptofaces');
        });

        it('should has a symbol', async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, 'Ṏ');
        });
    })
});