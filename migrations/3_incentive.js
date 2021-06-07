var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var manifest = artifacts.require("./Manifest.sol");
var incentive = artifacts.require("./Incentive.sol");
var Lib = artifacts.require("./imported/verify.sol");
var LocalStorage = require('node-localstorage').LocalStorage;
OracleStorage = new LocalStorage('../data/Oracle');
ManifestAddrStorage = new LocalStorage('../data/ManifestAddr');
AdminStorage = new LocalStorage('../data/Admin');
WTStorageA = new LocalStorage('../data/WatchTowerA');
PunisherStorage = new LocalStorage('../data/Punisher');

module.exports = function(deployer, network, accounts) {
    if (network == "development") {
        deployer.deploy(Lib);
        deployer.link(Lib, incentive);
        deployer.link(Lib, manifest);
        //account[1] oracle
        var publickeyOracle = "0xc6A9f3e4ba1d87B4f310a8225d10CB9698B25422";
        OracleStorage.setItem("private", "0x47f4ab837d8cea10142a5cbe1782b7986756569d7e97885f1958ac0ba3af6487");
        OracleStorage.setItem("public", publickeyOracle);
        //account[2] admin
        var publickeyAdmin = "0x1aB7edeb87f0Bb48323992f81863b93ca6733E53";
        AdminStorage.setItem("private", "0xa86bef7bb43b47dd8c80a3c467c517364e823026de9903770488e7f223c11a6d");
        AdminStorage.setItem("public", publickeyAdmin);
        //account[4] punisher
        var publickeyPunisher = "0x508b0BC9f3B8861D17daE93f906E2eB1cE92225a";
        PunisherStorage.setItem("private", "0x2b428216c7ac79884e42175e18a7df02ba6f44066a6c1f26ed2b800a31406ee3");
        PunisherStorage.setItem("public", publickeyPunisher);
        //account[3] watchtower
        var publickeyWT = "0xA58A45a64B0c2b3116D7593f544Fae91A33dc373";
        WTStorageA.setItem("private", "0xf8bb4d47e3406a4d3332aaa1fc50c83b1edf9dd000ab9463125a550a23e9da25");
        WTStorageA.setItem("public", publickeyWT);
        


        deployer.deploy(manifest, {from:accounts[1]}).then(function(manifestInstance){
            ManifestAddrStorage.setItem("manifest", manifestInstance.address);
            return deployer.deploy(incentive, {from:accounts[2]}).then(function(incentiveInstance){
                return incentiveInstance.oracle_register(manifestInstance.address, {from:accounts[1], value:111}).then(function(oracleRegInstance){
                    return incentiveInstance.watchtower_register({from:accounts[3], value:222}).then(function(WTRegInstance){
                        console.log("Register done!");
                    });
                });
            });
        });




        // deployer.deploy(tower, {from:accounts[1]}).then(function(towerInstance){
        //     CidStorage.setItem("tower", towerInstance.address);
        //     // return towerInstance.deposit({from:accounts[4], value:48}).then(function(depoistInstance){
        //     //     // return towerInstance.getDeposit.call(accounts[1]).then(function(deIns){
        //             return deployer.deploy(channel, {from:accounts[2]}).then(function(channelInstance){
        //                 CidStorage.setItem("1", channelInstance.address);
        //                 return towerInstance.deposit(CidStorage.getItem("1"), {from:accounts[4], value:48}).then(function(depoistInstance){
        //                 // return towerInstance.getDeposit.call(accounts[1]).then(function(deIns){
        //                     return channelInstance.setUp(publickeyTower, towerInstance.address, {from:accounts[3], value:10}).then(function(setUpAInstance){
        //                         console.log(towerInstance.address)
        //                         return channelInstance.deposit({from:accounts[4], value:5}).then(function(setUpBInstance){
        //                             console.log('first test!')
        //                         });
        //                     });
        //                 });
        //             }); 
        // });
    }else {
        console.log("wrong nework configuration!");
    }    
};