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
    const alexAcc = accounts[9];

    const expectedOwnerTokens = [100001, 100002, 100003, 100003];

    const BASE_URI = 'https://ipfs.infura.io/ipfs/';

    before(async () => {
        contract = await CryptoFaces.deployed();
        //console.log(contract);
    });

    describe('A. Like a full ERC721', async () => {

        describe('1. Deployment', async () => {

            /*
             * contract - CryptoFaces
             * method - constructor()
             */
            it('a. should deployed successfully', async () => {
                const _address = contract.address;

                assert.notEqual(_address, '');
                assert.notEqual(_address, null);
                assert.notEqual(_address, 0x0);
                assert.notEqual(_address, undefined);
            });
        });

        describe('2. Contract Metadata', async () => {

            /*
             * contract - ERC721 Metadata
             * method - name():string
             */
            it('a. should has a name', async () => {
                const _name = await contract.name();

                assert.equal(_name, name);
            });

            /*
             * contract - ERC721 Metadata
             * method - symbol():string
             */
            it('b. should has a symbol', async () => {
                const _symbol = await contract.symbol();

                assert.equal(_symbol, symbol);
            });

            /*
             * contract - AccessControl
             * method - owner():string
             */
            it('c. should has owner', async () => {
                const _owner = await contract.owner();

                assert.equal(_owner, owner)
            });
        });

        describe('3. Mint new Token', async () => {

            /*
             * contract - CryptoFaces
             * method - mint(_to: address, _tokenURI: String)
             */
            it('a. should mint new token', async () => {
                const _imageURI = 'QmdP14WWurNzKDPdHDjwS8QDbNdSQyySxTedKqHzKcReBb';

                const result = await contract.mint(owner, _imageURI.toString(), { from: owner });

                const mintEvent = result.logs[1].args;

                //console.log(mintEvent);

                // TODO: check Minted Event
                //assert.equal(mintEvent._tokenId.words[0].toNumber(), 100001);
                //assert.equal(mintEvent._tokenURI.toString(), _imageURI);
                //assert.equal(mintEvent._buyer.toString(), owner);
            });

            /*
             * contract - CryptoFaces
             * method - mint(_to: address, _tokenURI: String)
             */
            it('b. should mint second token', async () => {
                const _imageURI = 'QmdP14WWurNzKDPdHDjwS8QDbNdSQyySxTedKqHzKcRserb';

                await contract.mint(owner, _imageURI, {
                    from: owner
                });
            });

            /*
             * contract - CryptoFaces
             * method - mint(_to: address, _tokenURI: String)
             */
            it('c. should mint third token', async () => {
                const _imageURI = 'QmdP14WWurNzKdfDPdHDjwS8QDbNdSQyySxTedKqHzKcRserb';

                await contract.mint(alexAcc, _imageURI, {
                    from: owner
                });

                const _totalSupply = await contract.totalSupply();

                //assert.equal(_totalSupply, 3);
            });

            /*
             * contract - CryptoFaces
             * method - mint(_to: address, _tokenURI: String)
             */
            it('d. should reject minting new Token from non-CF-Artist account', async () => {
                const _imageURI = 'QmdP14WWurNzKdfDPdHDjwS8rwerNdSQyySxTedKqHzKcRserb';

                // account1 => non-authorized
                await contract.mint(alexAcc, _imageURI, {
                    from: account1
                }).should.be.rejected;
            });

            /*
            * contract - CryptoFaces
            * method - mint(_to: address, _tokenURI: String)
            */
            it('e. should reject minting new token with the same used URI', async () => {
                const _imageURI = 'QmdP14WWurNzKdfDPdHDjwS8QDbNdSQyySxTedKqHzKcRserb';

                await contract.mint(alexAcc, _imageURI, {
                    from: owner
                }).should.be.rejected;
            });
        });

        describe('4. Token Outputs Data', async () => {

            /*
             * contract - CryptoFaces
             * method - mint(_to: address, _tokenURI: String)
             */
            it('a. should output second tokenId', async () => {
                //const _secondTokenId = await contract.tokenOfOwnerByIndex(owner, 2);

                //assert.equal(_secondTokenId, expectedOwnerTokens[1]);
            });

            /**
             * contract - CryptoFaces
             * method - mint(_to: address, _tokenURI: String)
             */
            it('b. should output tokens Ids for owner', async () => {
                const _ownerTokens = await contract.tokensOf(owner);
                const outputOwnerTokens = [];

                _ownerTokens.forEach( element => {
                    const tokenId = element.words[0];
                    outputOwnerTokens.push(tokenId);
                });

                assert.equal(outputOwnerTokens, outputOwnerTokens);
            });

            /**
             * contract - CryptoFaces
             * method - exists(_to: address, _tokenURI: String)
             */
            it('c. should output whether the tokenId exits or not', async () => {
                const isExist = await contract.exists(expectedOwnerTokens[0]);

                assert.equal(isExist, true);
            });
        });

        describe('5. Token Metadata', async () => {
            /*
             * contract - ERC721
             * method - balanceOf(owner: address):uint256
             */
            it('a. should output the balanceOf', async () => {
                const _ownerBalance = await contract.balanceOf(owner);

                // assert.equal(_ownerBalance, 3);
            });

            /*
             * contract - ERC721
             * method - ownerOf(tokenId: uint256):address
             */
            it('b. should output the owner address of the tokenId', async () => {
                const tokenOwnerAddress = await contract.ownerOf(100002);

                assert.equal(owner, tokenOwnerAddress);
            });
        });

        describe('6. Token Approval', async () => {

            /*
            * contract - ERC721
            * method - ownerOf(tokenId: uint256):address
            */
            it('a. should successfully approve owner to another address', async () => {
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
            it('b. should reject approve non-owner to another address', async () => {
                await contract.approve(account2, expectedOwnerTokens[1], {
                    from: account1
                }).should.be.rejected;
            });

            /*
             * contract - ERC721
             * method - getApproved(tokenId: uint256):address
             */
            it('c. should get the approved account for specific token', async () => {
                const approvedAccount = await contract.getApproved(expectedOwnerTokens[0]);

                assert.equal(approvedAccount.toString(), account1);

                // Check the ownership of the approved token
                const ownerOfApprovedToken = await contract.ownerOf(expectedOwnerTokens[0]);

                assert.equal(ownerOfApprovedToken.toString(), owner);
            });
        });

        describe('7. Token Transfer', async () => {

        });
    })
});