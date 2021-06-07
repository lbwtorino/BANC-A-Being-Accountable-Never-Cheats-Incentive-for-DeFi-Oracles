var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
var microtime = require('microtime')
OracleStorage = new LocalStorage('./data/Oracle');
ManifestAddrStorage = new LocalStorage('./data/ManifestAddrStorage');
AdminStorage = new LocalStorage('./data/Admin');
WTStorageA = new LocalStorage('./data/WatchTowerA');
var manifest = artifacts.require("./Manifest.sol");
var incentive = artifacts.require("./Incentive.sol");
var Punisher = require('../Party/Punisher.js')
var Oracle = require('../Party/Oracle.js')
var WatchTowerA = require('../Party/WatchTowerA.js')

contract('Incentive', function(accounts) {
    it("test wrong source", function() {
        var proof_punish_3_wrong_source = Punisher.submit_punishment_3_wrong_source();
        console.log(proof_punish_3_wrong_source)
        return manifest.deployed().then(function(manifestInstance) {
            return manifestInstance.getInfor.call().then(function(manifestValue){
                return incentive.deployed().then(function(incentiveInstance) {
                    // function punish(address oracle, uint behavior, uint time, uint time_rapid, uint price, bytes prices, bytes sources, byte _v, bytes32 _r, bytes32 _s) public {
                    return incentiveInstance.punish(accounts[1], 3, proof_punish_3_wrong_source[0], 0, 0, '', proof_punish_3_wrong_source[1], proof_punish_3_wrong_source[2].v, proof_punish_3_wrong_source[2].r, proof_punish_3_wrong_source[2].s, {from: accounts[4]}).then(function(punishRes){
                        var logging_punish = punishRes.logs[0];
                        console.log(logging_punish)
                        if (logging_punish.event == "Punish"){
                            var oracle_punished = logging_punish.args.oracle;
                            WTStorageA.setItem("oracle", oracle_punished);
                        }
                        return incentiveInstance.getInfor.call().then(function(punishValue){
                            console.log(punishValue);
                            var proof_dispute_3_wrong_source = Oracle.submit_dispute_3_wrong_source();
                            // function dispute(uint behavior, uint time, uint time_rapid, uint price, bytes prices, bytes sources, byte _v, bytes32 _r, bytes32 _s) public {
                            return incentiveInstance.dispute(3, proof_dispute_3_wrong_source[0], 0, 0, '', proof_dispute_3_wrong_source[1], proof_dispute_3_wrong_source[2].v, proof_dispute_3_wrong_source[2].r, proof_dispute_3_wrong_source[2].s, {from: accounts[1]}).then(function(disputeRes){
                                var logging_dispute = disputeRes.logs[0];
                                console.log(logging_dispute)
                                if (logging_dispute.event == "Dispute"){
                                    var oracle_dispute = logging_dispute.args.oracle;
                                    if(oracle_dispute == WTStorageA.getItem("oracle")){
                                        WTStorageA.setItem("oracle", oracle_dispute);
                                    }
                                }
                                return incentiveInstance.getInfor.call().then(function(disputeValue){
                                    // console.log(disputeValue);
                                    var vote_resolve_3_wrong_source = WatchTowerA.submit_resolve_3_wrong_source();
                                    var oracle_WTA = WTStorageA.getItem("oracle")
                                    return incentiveInstance.resolve(oracle_WTA, 3, vote_resolve_3_wrong_source[0], vote_resolve_3_wrong_source[1].v, vote_resolve_3_wrong_source[1].r, vote_resolve_3_wrong_source[1].s, {from: accounts[3]}).then(function(resolveRes){
                                        return incentiveInstance.getInfor.call().then(function(resolveValue){
                                            console.log(resolveValue);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
