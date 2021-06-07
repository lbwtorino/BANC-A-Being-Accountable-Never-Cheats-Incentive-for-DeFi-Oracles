var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
var microtime = require('microtime')
var tower = artifacts.require("./Tower.sol");
var channel = artifacts.require("./Channel.sol");
var Tower = require('../Tower/Tower.js')
var A = require('../Party/A.js')
var B = require('../Party/B.js')
AStorage = new LocalStorage('./data/A');
BStorage = new LocalStorage('./data/B');
CidStorage = new LocalStorage('./data/cid');
TowerStorage = new LocalStorage('./data/Tower');
BitmapStorage = new LocalStorage('./data/Bitmap');
AKeyStorage = new LocalStorage('./data/AKey');
BKeyStorage = new LocalStorage('./data/BKey');
TowerKeyStorage = new LocalStorage('./data/TowerKey');

contract('Channel', function(accounts) {
    it("test Channel", function() {
        var balA = 10;
        var balB = 0;
        var round = 1;
        var channelAddr = CidStorage.getItem("1");

        var txNum = 1;
        var balanceA = [10, 7, 4];
        var balanceB = [0, 3, 6];
        var sequence = [1, 2, 3];
        var cid = [channelAddr, channelAddr,channelAddr];

        for (var i=0; i<txNum; i++){
            A.sendToB(balanceA[0], balanceB[0], sequence[0], cid[0]);
        }

        var random = JSON.parse(AStorage.getItem(channelAddr)).r;
        var _v = [];
        var _r = [];
        var _s = [];
        _v.push(JSON.parse(AStorage.getItem(channelAddr)).sigA.v);
        _r.push(JSON.parse(AStorage.getItem(channelAddr)).sigA.r);
        _s.push(JSON.parse(AStorage.getItem(channelAddr)).sigA.s);
        _v.push(JSON.parse(AStorage.getItem(channelAddr)).sigB.v);
        _r.push(JSON.parse(AStorage.getItem(channelAddr)).sigB.r);
        _s.push(JSON.parse(AStorage.getItem(channelAddr)).sigB.s);

        function convertToList(strbitmap, intbitmap){
            var times = strbitmap.length / 256;
            var result = [];
            for (var i=0; i<times; i++){
                result.push(parseInt(intbitmap % Math.pow(2,256)));
                intbitmap = parseInt(intbitmap / Math.pow(2,256));
            }
            return result;
        }
        
        return channel.deployed().then(function(channelInstance) {
            return channelInstance.terminate(balA, balB, round, random, _v, _r, _s, {from: accounts[3]}).then(function(res){
                var logging = res.logs[0];
                var blockNumber = logging.blockNumber;
                var counter = 0;
                if (logging.event == "Closure"){
                    var CID = logging.args.cid;
                    var eventState = [parseInt(logging.args.A), parseInt(logging.args.B), parseInt(logging.args.random), parseInt(logging.args.round)];
                    var randomMsg = eventState[0].toString() + eventState[1].toString() + eventState[2].toString();
                    var eventHvalue = web3.utils.sha3(randomMsg);
                    var latestHvalue = JSON.parse(TowerStorage.getItem(CID)).Hvalue;
                    if (eventHvalue == latestHvalue && eventState[3] >= JSON.parse(TowerStorage.getItem(CID)).sequence){
                        console.log('It is latest !');
                        if (BitmapStorage.getItem(counter) == null){
                            var channelSequence = {};
                            var tmp = {timestamp: microtime.now(), bitmap: 1};
                            channelSequence[CID] = tmp;
                            BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                        }else{
                            var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                            var tmp = {timestamp: microtime.now(), bitmap: 1};
                            currentCid[CID] = tmp;
                            BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                        }
                    }else {
                        console.log('It is not latest !')
                        if (BitmapStorage.getItem(counter) == null){
                            var channelSequence = {};
                            var tmp = {timestamp: microtime.now(), bitmap: 0};
                            channelSequence[CID] = tmp;
                            BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                        }else{
                            var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                            var tmp = {timestamp: microtime.now(), bitmap: 0};
                            currentCid[CID] = tmp;
                            BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                        }
                    }
                }
                var _vdis = []
                var _rdis = []
                var _sdis = []
                _vdis.push(JSON.parse(BStorage.getItem(channelAddr)).sigB.v);
                _rdis.push(JSON.parse(BStorage.getItem(channelAddr)).sigB.r);
                _sdis.push(JSON.parse(BStorage.getItem(channelAddr)).sigB.s);
                _vdis.push(JSON.parse(BStorage.getItem(channelAddr)).sigA.v);
                _rdis.push(JSON.parse(BStorage.getItem(channelAddr)).sigA.r);
                _sdis.push(JSON.parse(BStorage.getItem(channelAddr)).sigA.s);
                return channelInstance.dispute(balA, balB, round, random, _vdis, _rdis, _sdis, {from:accounts[4]}).then(function(disputeres){
                    var log = disputeres.logs[0];
                    var counter = 0;
                    if (log.event == "Dispute"){
                        var disCID = log.args.cid;
                        var eventState = [parseInt(log.args.A), parseInt(log.args.B), parseInt(log.args.random), parseInt(log.args.round)];
                        var randomMsg = eventState[0].toString() + eventState[1].toString() + eventState[2].toString();
                        var eventHvalue = web3.utils.sha3(randomMsg);
                        var latestHvalue = JSON.parse(TowerStorage.getItem(disCID)).Hvalue;
                        if (eventHvalue == latestHvalue && eventState[3] >= JSON.parse(TowerStorage.getItem(disCID)).sequence){
                            console.log('It is latest !');
                            if (BitmapStorage.getItem(counter) == null){
                                var channelSequence = {};
                                var tmp = {timestamp: microtime.now(), bitmap: 1};
                                channelSequence[disCID] = tmp;
                                BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                            }else{
                                var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                var tmp = {timestamp: microtime.now(), bitmap: 1};
                                currentCid[disCID] = tmp;
                                BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                            }
                        }else {
                            console.log('It is not latest !')
                            if (BitmapStorage.getItem(counter) == null){
                                var channelSequence = {};
                                var tmp = {timestamp: microtime.now(), bitmap: 0};
                                channelSequence[disCID] = tmp;
                                BitmapStorage.setItem(counter, JSON.stringify(channelSequence));
                            }else{
                                var currentCid = JSON.parse(BitmapStorage.getItem(counter));
                                var tmp = {timestamp: microtime.now(), bitmap: 0};
                                currentCid[disCID] = tmp;
                                BitmapStorage.setItem(counter, JSON.stringify(currentCid));
                            }
                        }
                    }

                    return tower.deployed().then(function(towerInstance){
                        return towerInstance.getCid.call().then(function(cidInstance){
                            var bitmapToUpdate = "";
                            var bitmapToUpdateValue = 0;
                            console.log('cidlist:'+cidInstance);
                            for (var i=0; i<cidInstance.length; i++){
                                bitmapToUpdate = JSON.parse(BitmapStorage.getItem(counter))[cidInstance[i]].bitmap.toString() + bitmapToUpdate ;
                                bitmapToUpdateValue += parseInt(JSON.parse(BitmapStorage.getItem(counter))[cidInstance[i]].bitmap.toString()) * Math.pow(2,i);
                            }
                            // console.log("bitmapToUpdate:"+bitmapToUpdate);
                            // console.log("bitmapToUpdateValue:"+bitmapToUpdateValue);
                            // bitmapToUpdate = "1111000011110000";
                            // bitmapToUpdateValue = 61680;
                            var bitmapList = [];
                            // for (var i=0; i< 390; i++){
                            //     bitmapList.push(parseInt(Math.random()*(255+1),10));
                            // }
                            // console.log(bitmapList);
                            bitmapList = convertToList(bitmapToUpdate, bitmapToUpdateValue);
                            console.log(bitmapList);
                            return towerInstance.update(bitmapList, {from:accounts[1]}).then(function(updateInstance){
                                // var bHvalue = JSON.parse(BStorage.getItem("tower")).Hvalue;
                                // var bround = JSON.parse(BStorage.getItem("tower")).sequence;
                                // console.log(bHvalue, bHvalue.length);
                                // var bv = JSON.parse(BStorage.getItem("tower")).sigTower.v;
                                // var br = JSON.parse(BStorage.getItem("tower")).sigTower.r;
                                // var bs = JSON.parse(BStorage.getItem("tower")).sigTower.s;  
                                // var privateKeyTower = TowerKeyStorage.getItem("private");
                                // return channelInstance.challenge(bHvalue, bround, bv, br, bs, {from:accounts[4]}).then(function(challengeIns){
                                //     return towerInstance.getInfor.call().then(function(vvv){
                                //         console.log(vvv);
                                //         return channelInstance.getInfor.call().then(function(channelVal){
                                //             console.log(channelVal); 
                                //         });
                                //     });
                                // });
                                return towerInstance.getInfor.call().then(function(vvv){
                                    console.log(vvv);
                                    return channelInstance.getInfor.call().then(function(channelVal){
                                        console.log(channelVal); 
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
