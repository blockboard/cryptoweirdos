const CryptoFaces = artifacts.require("./contracts/CryptoFaces.sol");

require('chai')
    .use(require("chai-as-promised"))
    .should();

contract('CryptoFaces', (accounts) => {
    let contract;

    const name = 'CryptoFaces';
    const symbol = 'CF';

    const owner = accounts[0];
    const account1 = accounts[1];
    const account2 = accounts[2];

    const expectedOwnerTokens = [100001, 100002, 100003];

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

        describe('Contract Metadata', async () => {
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

                await contract.mint(_imageURI, {
                    from: owner
                });
                const _totalSupply = await contract.totalSupply();

                assert.equal(_totalSupply, 1);
            });

            it('should mint another token', async () => {
                const _imageURI = 'QmdP14WWurNzKDPdHDjwS8QDbNdSQyySxTedKqHzKcRserb';

                await contract.mint(_imageURI, {
                    from: owner
                });
                const _totalSupply = await contract.totalSupply();

                assert.equal(_totalSupply, 2);
            });

            it('should mint third token', async () => {
                const _imageURI = 'QmdP14WWurNzKdfDPdHDjwS8QDbNdSQyySxTedKqHzKcRserb';

                await contract.mint(_imageURI, {
                    from: owner
                });
                const _totalSupply = await contract.totalSupply();

                assert.equal(_totalSupply, 3);
            });

            it('should output second tokenId', async () => {
                const _secondTokenId = await contract.tokenOfOwnerByIndex(owner, 2);

                assert.equal(_secondTokenId, 100003);
            });

            it('should output tokens Ids for owner', async () => {
                const _ownerTokens = await contract.tokensOf(owner);
                const outputOwnerTokens = [];

                _ownerTokens.forEach( element => {
                    const tokenId = element.words[0];
                    outputOwnerTokens.push(tokenId);
                });

                assert.equal(outputOwnerTokens, outputOwnerTokens);
            });
        });

        describe('Token Metadata', async () => {
            /*
             * contract - ERC721
             * method - balanceOf(owner: address):uint256
             */
            it('should output the balanceOf', async () => {
                const _ownerBalance = await contract.balanceOf(owner);

                assert.equal(_ownerBalance, 3);
            });

            /*
             * contract - ERC721
             * method - ownerOf(tokenId: uint256):address
             */
            it('should output the owner address of the tokenId', async () => {
                const tokenOwnerAddress = await contract.ownerOf(100002);

                assert.equal(owner, tokenOwnerAddress);
            });
        });

        describe('Token Approval', async () => {

            /*
            * contract - ERC721
            * method - ownerOf(tokenId: uint256):address
            */
            it('should successfully approve owner to another address', async () => {
                const result = await contract.approve(account1, expectedOwnerTokens[0], { from: owner });

                // Success
                const approvalEvent = result.logs[0].args;

                assert.equal(approvalEvent.owner.toString(), owner);
                assert.equal(approvalEvent.approved.toString(), account1);
                assert.equal(approvalEvent.tokenId.toNumber(), expectedOwnerTokens[0])
            });

            /*
            * contract - ERC721
            * method - ownerOf(tokenId: uint256):address
            */
            it('should reject approve non-owner to another address', async () => {
                await contract.approve(account2, expectedOwnerTokens[1], {
                    from: account1
                }).should.be.rejected;
            });

            /*
             * contract - ERC721
             * method - getApproved(tokenId: uint256):address
             */
            it('should get the approved account for specific token', async () => {
                const approvedAccount = await contract.getApproved(expectedOwnerTokens[0]);

                assert.equal(approvedAccount.toString(), account1);

                // Check the ownership of the approved token
                const ownerOfApprovedToken = await contract.ownerOf(expectedOwnerTokens[0]);

                assert.equal(ownerOfApprovedToken.toString(), owner);
            });
        })
    })
});