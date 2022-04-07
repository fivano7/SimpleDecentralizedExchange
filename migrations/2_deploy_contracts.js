//Migration fileovi uzmu smart contract i stave ga na blockchain
//Artifacts je javascript verzija smart contracta sa jsonom
//truffle deployer ih zna staviti na blockchain
//Migrationi postoje i kod promjene verzije baze podataka (kao u androidu)
//Ovdje mijenjamo blockchain sa jedne verzije na drugu
//Zapravo migriramo smart contracte sa development enviromenta u blockchain
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {
    //Deploy token
    await deployer.deploy(Token);
    const token = await Token.deployed();

    //Deploy ethSwap
    await deployer.deploy(EthSwap, token.address);
    const ethSwap = await EthSwap.deployed();

    //Prebaci sve tokene na EthSwap (sa prvog ganache računa) - ima ih 1miliun
    //Zovemo transfer funckiju sa smartcontracta
    await token.transfer(ethSwap.address, "1000000000000000000000000")
};