var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
WTStorageA = new LocalStorage('./data/WatchTowerA');
// var B = require('../Party/B.js')
// var Tower = require('../Tower/Tower.js')

var privateKeyWTA = WTStorageA.getItem("private");
var publicKeyWTA = WTStorageA.getItem("public");


function pad(num) {
    var str = ''
    for (var i=0; i<num; i++){
        str += '0'
    }
    return str
}

function submit_resolve_1_late_report(){
    var behavior = 1;
    var decision = 1;
    var Msg = behavior.toString() + decision.toString();
    var sigWTA = web3.eth.accounts.sign(Msg, privateKeyWTA);
    return [decision, sigWTA];
}

function submit_resolve_2_high_deviation(){
    var behavior = 2;
    var decision = 1;
    var Msg = behavior.toString() + decision.toString();
    // var privatekeyPunisher = "0xdb5269258a5eb1d3cbdd9cf527c22733e9ff468477af96e53efa306c31829b9a"
    // var hvalue = web3.utils.sha3(randomMsg);
    // var wholeMsg =  hvalue.substring(2)+pad(64-hvalue.substring(2).length) + round.toString();
    var sigWTA = web3.eth.accounts.sign(Msg, privateKeyWTA);
    // console.log(Msg, v, r, s)
    return [decision, sigWTA];
}

function submit_resolve_3_wrong_source(){
    var behavior = 3;
    var decision = 1;
    var Msg = behavior.toString() + decision.toString();
    var sigWTA = web3.eth.accounts.sign(Msg, privateKeyWTA);
    // console.log(Msg, v, r, s)
    return [decision, sigWTA];
}

function submit_resolve_4_wrong_methodology(){
    var behavior = 4;
    var decision = 1;
    var Msg = behavior.toString() + decision.toString();
    // var privatekeyPunisher = "0xdb5269258a5eb1d3cbdd9cf527c22733e9ff468477af96e53efa306c31829b9a"
    // var hvalue = web3.utils.sha3(randomMsg);
    // var wholeMsg =  hvalue.substring(2)+pad(64-hvalue.substring(2).length) + round.toString();
    var sigWTA = web3.eth.accounts.sign(Msg, privateKeyWTA);
    // console.log(Msg, v, r, s)
    return [decision, sigWTA];
}

function submit_resolve_5_slow_reaction(){
    var behavior = 5;
    var decision = 1;
    var Msg = behavior.toString() + decision.toString();
    var sigWTA = web3.eth.accounts.sign(Msg, privateKeyWTA);
    return [decision, sigWTA];
}



module.exports.submit_resolve_1_late_report = submit_resolve_1_late_report;
module.exports.submit_resolve_2_high_deviation = submit_resolve_2_high_deviation;
module.exports.submit_resolve_3_wrong_source = submit_resolve_3_wrong_source;
module.exports.submit_resolve_4_wrong_methodology = submit_resolve_4_wrong_methodology;
module.exports.submit_resolve_5_slow_reaction = submit_resolve_5_slow_reaction;
