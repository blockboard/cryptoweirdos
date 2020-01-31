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

                assert.notEqual(_address, '');
                assert.notEqual(_address, null);
                assert.notEqual(_address, 0x0);
                assert.notEqual(_address, undefined);
            });
        });

        describe('Metadata', async () => {
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
        });

        describe('Mint', async () => {
            it('should mint new token', async () => {
                const _imageURI = 'QmdP14WWurNzKDPdHDjwS8QDbNdSQyySxTedKqHzKcReBb';
                const _imageURI2 = 'QmdP14WWurNzKDPdHDjwS8QDbNdSQyySxTedKqHzKcRserb';

                await contract.mintFaceToken(_imageURI, {
                    from: owner
                });
                const _totalSupply = await contract.totalSupply();

                assert.equal(_totalSupply, 1);
            });

            it('should mint another token', async () => {
                const _imageURI = 'QmdP14WWurNzKDPdHDjwS8QDbNdSQyySxTedKqHzKcRserb';

                await contract.mintFaceToken(_imageURI, {
                    from: owner
                });
                const _totalSupply = await contract.totalSupply();

                assert.equal(_totalSupply, 2);
            });

            it('should mint third token', async () => {
                const _imageURI = 'QmdP14WWurNzKdfDPdHDjwS8QDbNdSQyySxTedKqHzKcRserb';

                await contract.mintFaceToken(_imageURI, {
                    from: owner
                });
                const _totalSupply = await contract.totalSupply();

                assert.equal(_totalSupply, 3);
            });

            it('should output the balanceOf', async () => {
                const _ownerBalance = await contract.balanceOf(owner);

                assert.equal(_ownerBalance, 3);
            });

            it('should output second tokenId', async () => {
                const _secondTokenId = await contract.tokenOfOwnerByIndex(owner, 2);

                assert.equal(_secondTokenId, 100003);
            });

            it('should output tokens Ids for owner', async () => {
                const _ownerTokens = await contract.tokensOf(owner);
                const expectedOwnerTokens = [100001, 100002, 100003];
                const outputOwnerTokens = [];

                _ownerTokens.forEach( element => {
                    const tokenId = element.words[0];
                    outputOwnerTokens.push(tokenId);
                });

                //console.log(outputOwnerTokens);

                assert.equal(outputOwnerTokens, outputOwnerTokens);
            });
        })
    })
});