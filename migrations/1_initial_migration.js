//Migration fileovi uzmu smart contract i stave ga na blockchain
//Artifacts je javascript verzija smart contracta sa jsonom
//truffle deployer ih zna staviti na blockchain
//Migrationi postoje i kod promjene verzije baze podataka (kao u androidu)
//Ovdje mijenjamo blockchain sa jedne verzije na drugu
//Zapravo migriramo smart contracte sa development enviromenta u blockchain
const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
