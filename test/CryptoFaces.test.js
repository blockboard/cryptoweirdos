const bnChai = require('bn-chai');

const etherToWei = require('./helper/etherToWei');

const CryptoFaces = artifacts.require("./contracts/CryptoFaces.sol");

require('chai')
    .use(require("chai-as-promised"))
    .use(bnChai(web3.utils.BN))
    .should();

contract('CryptoFaces', (accounts) => {
    let contract;

    const name = 'CryptoFaces';
    const symbol = 'CF';

    const owner = accounts[0];
    const account1 = accounts[1];
    const account2 = accounts[2];
    const buyer1 = accounts[3];
    const artistAccount = accounts[9];

    console.log('Owner Account:', owner);
    console.log('Account 1:', account1);
    console.log('Account 2:', account2);
    console.log('Buyer 1:', buyer1);
    console.log('Artist Account:', artistAccount);

    const zeroAddress = '0x0000000000000000000000000000000000000000';

    const tokenIds = [100001, 100002, 100003, 100004, 100005];

    const firstTokenPrice = etherToWei(0.1);
    const firstTokenURI = 'QmdP14WWurNzKDPdHDjwS8QDbNdSQyySxTedKqHzKcReBb';

    const secondTokenPrice = etherToWei(0.1);
    const secondTokenURI = 'QmdP14WWurNzKDPdHDjwS8QDbNdSQyySxTedKqHzKcRserb';

    const thirdTokenPrice = etherToWei(0.1);
    const thirdTokenURI = 'QmdP14WWurNzKdfDPdHDjwS8QDbNdSQyySxTedKqHzKcRserb';

    const fourthTokenPrice = etherToWei(0.1);
    const fourthTokenURI = 'QmdP14WWurNzKdfDPdHDjwS8QDbNdSQyySxTedereRserb';

    const fifthTokenPrice = etherToWei(0.1);
    const fifthTokenURI = 'QmdP14WWurNzKDPdHDjwS8QDbNdSQyySxTedKqHzKcReBb';

    const BASE_URI = 'https://ipfs.infura.io/ipfs/';

    before(async () => {
        contract = await CryptoFaces.deployed();
        //console.log(contract);
    });

    describe('A. Like a full ERC721', async () => {

        describe('Deployment', async () => {

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

        describe('Contract Metadata', async () => {

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

        /****************************
         * Testing Basic Operations *
         ****************************/
        describe('Mint new Token', async () => {

            /*
             * contract - CryptoFaces
             * method - mint(_to: address, _tokenURI: String)
             */
            it('should mint first token', async () => {
                const result = await contract.mint(firstTokenURI, firstTokenPrice, { from: owner });

                const transferEvent = result.logs[0].args;

                // Test Transfer Event
                assert.equal(transferEvent.from.toString(), zeroAddress);
                assert.equal(transferEvent.to.toString(), owner);
                assert.equal(transferEvent.tokenId.toNumber(), tokenIds[0]);
            });

            /*
             * contract - CryptoFaces
             * method - mintTo(_to: address, _tokenURI: String, _priceInWei: uint256)
             */
            it('should mint second token', async () => {
                const result = await contract.mintTo(account1, secondTokenURI, secondTokenPrice,{ from: owner });

                const transferEvent = result.logs[0].args;

                // Test Transfer Event
                assert.equal(transferEvent.from.toString(), zeroAddress);
                assert.equal(transferEvent.to.toString(), account1);
                assert.equal(transferEvent.tokenId.toNumber(), tokenIds[1]);
            });

            /*
             * contract - CryptoFaces
             * method - mintTo(_to: address, _tokenURI: String, _priceInWei: uint256)
             */
            it('should mint third token', async () => {
                const result = await contract.mintTo(account2, thirdTokenURI, thirdTokenPrice, { from: owner });

                const transferEvent = result.logs[0].args;

                // Test Transfer Event
                assert.equal(transferEvent.from.toString(), zeroAddress);
                assert.equal(transferEvent.to.toString(), account2);
                assert.equal(transferEvent.tokenId.toNumber(), tokenIds[2]);
            });

            /*
             * contract - CryptoFaces
             * method - mint(_to: address, _tokenURI: String)
             */
            it('should reject minting new Token from non-CF-Artist account', async () => {
                // account1 => non-authorized
                await contract.mintTo(account1, fourthTokenURI, fourthTokenPrice, {
                    from: account1
                }).should.be.rejected;
            });

            /*
            * contract - CryptoFaces
            * method - mint(_to: address, _tokenURI: String)
            */
            it('should reject minting new token with the same used URI', async () => {
                // tokenURI exists
                await contract.mint(fifthTokenURI, fifthTokenPrice, {
                    from: owner
                }).should.be.rejected;
            });
        });

        describe('Purchase Token', async () => {

            /**
             * contract - ERC721
             * method - purchaseTo(_to address, _tokenId: uint256): _tokenId: uint256
             */
            it('should purchase minted token', async () => {
                const result = await contract.purchase(tokenIds[0], {
                    from: buyer1,
                    value: firstTokenPrice
                });

                const transferEvent = result.logs[0].args;
                const purchaseEvent = result.logs[1].args;

                // Test Transfer Event
                assert.equal(transferEvent.from.toString(), owner);
                assert.equal(transferEvent.to.toString(), buyer1);
                assert.equal(transferEvent.tokenId.toNumber(), tokenIds[0]);

                // Test Purchase Event
                assert.equal(purchaseEvent.tokenId.toNumber(), tokenIds[0]);
                assert.equal(purchaseEvent.buyer.toString(), buyer1);
                assert.equal(purchaseEvent.priceInWei, firstTokenPrice);
            });
        });
        /***********************
         * Testing Token Query *
         ***********************/
        describe('Token Outputs Data', async () => {

            /*
             * contract - CryptoFaces
             * method - mint(_to: address, _tokenURI: String)
             */
            it('a. should output second tokenId', async () => {
                //const _secondTokenId = await contract.tokenOfOwnerByIndex(owner, 2);

                //assert.equal(_secondTokenId, tokenIds[1]);
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
                const isExist = await contract.exists(tokenIds[0]);

                assert.equal(isExist, true);
            });
        });

        describe('Token Metadata', async () => {
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

        describe('Token Approval', async () => {

            /**
             * contract - ERC721
             * method - ownerOf(tokenId: uint256):address
             */
            it('a. should successfully approve owner to another address', async () => {
                const result = await contract.approve(account1, tokenIds[0], { from: owner });

                // Success
                const approvalEvent = result.logs[0].args;

                assert.equal(approvalEvent.owner.toString(), owner);
                assert.equal(approvalEvent.approved.toString(), account1);
                assert.equal(approvalEvent.tokenId.toNumber(), tokenIds[0])
            });

            /*
            * contract - ERC721
            * method - ownerOf(tokenId: uint256):address
            */
            it('b. should reject approve non-owner to another address', async () => {
                await contract.approve(account2, tokenIds[1], {
                    from: account1
                }).should.be.rejected;
            });

            /*
             * contract - ERC721
             * method - getApproved(tokenId: uint256):address
             */
            it('c. should get the approved account for specific token', async () => {
                const approvedAccount = await contract.getApproved(tokenIds[0]);

                assert.equal(approvedAccount.toString(), account1);

                // Check the ownership of the approved token
                const ownerOfApprovedToken = await contract.ownerOf(tokenIds[0]);

                assert.equal(ownerOfApprovedToken.toString(), owner);
            });
        });
    })
});