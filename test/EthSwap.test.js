const Token = artifacts.require("Token")
const EthSwap = artifacts.require("EthSwap")
const Web3 = require("web3");
const web3 = new Web3("HTTP://127.0.0.1:7545");

require("chai")
    .use(require("chai-as-promised"))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, "ether")
}

//contract("EthSwap", (accounts) => { //ovako pa accounts[0] i accounts[1] umjesto deployer i investor
contract("EthSwap", ([deployer, investor]) => {
    //Bitno ih je definirati prije
    let token, ethSwap;


    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        await token.transfer(ethSwap.address, tokens("1000000"))
    })

    //GRUPA
    describe("Token deployment", async () => {
        //UMJESTO DA NA VIŠE MJESTA KORISTIMO VARIJABLE ISPOD
        //SAMO IH STAVIO U DESCRIBE I DOBIJEMO ISTI EFEKT, OPTIMIZACIJA
        it("Contract has a name", async () => {
            const name = await token.name()
            assert.equal(name, "DApp Token")
        })
    })

    //GRUPA
    describe("EthSwap deployment", async () => {
        //TEST UNUTAR GRUPE
        it("Contract has a name", async () => {
            const name = await ethSwap.name()
            assert.equal(name, "EthSwap Instant Exchange")
        }),

            //TEST UNUTAR GRUPE
            it("Contract has tokens", async () => {
                let balance = await token.balanceOf(ethSwap.address)
                assert.equal(balance.toString(), tokens("1000000"))
            })
    })

    describe("buyTokens() funkcija", async () => {
        let result;
        before(async () => {
            //purchase tokens before each example
            result = await ethSwap.buyTokens({from: investor, value: web3.utils.toWei("1", "ether")})
        })

        it("Allows user to instantly purchase tokens from ethSwap for a fixed price", async () => {
            //Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens("100"))

            //Check ethSwap TOKEN balance after purchase
            let ethSwapBalance;
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens("999900"))

            //Check ethSwap ETHEREUM balance after purchase
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei("1", "ether"))

            //Check the TokensPurchased event
            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens("100").toString());
            assert.equal(event.rate.toString(), "100");
        })
    })

    describe("sellTokens() funkcija", async () => {
        let result;
        before(async () => {
            //Investor must approve TOKENS (with metamask) before the purchase
            await token.approve(ethSwap.address, tokens("100"), {from: investor})
            //Investor sells tokens
            result = await ethSwap.sellTokens(tokens("100"), {from: investor})
        })

        it("Allows user to instantly sell tokens from ethSwap for a fixed price", async () => {
            //Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens("0"))

            //Check ethSwap TOKEN balance after purchase
            let ethSwapBalance;
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens("1000000"))

            //Check ethSwap ETHEREUM balance after purchase
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei("0", "ether"));

            //Check the TokensSold event
            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens("100").toString());
            assert.equal(event.rate.toString(), "100");

            //FAILURE - investor can't sell more tokens than they have
            await ethSwap.sellTokens(tokens("500"), {from: investor}).should.be.rejected;
        })
    })
})

//truffle migrate --reset updatea ABI, ali test radi i bez toga