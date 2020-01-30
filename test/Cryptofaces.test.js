const CryptoFaces = artifacts.require("./contracts/CryptoFaces.sol");

require('chai')
    .use(require("chai-as-promised"))
    .should();

contract('CryptoFaces', (accounts) => {
    let contract;

    const name = 'CryptoFaces';
    const symbol = 'CF';

    const owner = accounts[0];

    const BASE_URI = 'https://ipfs.infura.io/ipfs/';

    before(async () => {
        contract = await CryptoFaces.deployed();
    });

    describe('Like a full ERC721', async () => {

        describe('Deployment', async () => {
            it('should deployed successfully', async () => {
                const _address = contract.address;
                console.log(_address);
                assert.notEqual(_address, '');
                assert.notEqual(_address, null);
                assert.notEqual(_address, 0x0);
                assert.notEqual(_address, undefined);
            });

            it('should has a name', async () => {
                const _name = await contract.name();
                assert.equal(_name, name);
            });

            it('should has a symbol', async () => {
                const _symbol = await contract.symbol();
                assert.equal(_symbol, symbol);
            });

            it('should has owner', async () => {
                const _owner = await contract.owner();
                assert.equal(_owner, owner)
            });

            /*it('should owner be from AccessControl Accounts', function () {
                const _ownerRole = await contract.methods.hasRole(owner, )
            });*/
        })
    })
});