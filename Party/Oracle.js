var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
OracleStorage = new LocalStorage('./data/Oracle');
// var B = require('../Party/B.js')
// var Tower = require('../Tower/Tower.js')

var privateKeyOracle = OracleStorage.getItem("private");
var publicKeyOracle = OracleStorage.getItem("public");


function pad(num) {
    var str = ''
    for (var i=0; i<num; i++){
        str += '0'
    }
    return str
}

function submit_dispute_1_late_report(){
    var time = 1620361402;
    var price = 1001;
    var reaction = 3;
    var Msg = time.toString() + price.toString();
    var sigOracle = web3.eth.accounts.sign(Msg, privateKeyOracle);
    return [time, price, sigOracle];
}

function submit_dispute_2_high_deviation(){
    var time = 1620361402;
    var price = 1001;
    // var reaction = 3;
    var Msg = time.toString() + price.toString();
    // var privatekeyPunisher = "0xdb5269258a5eb1d3cbdd9cf527c22733e9ff468477af96e53efa306c31829b9a"
    // var hvalue = web3.utils.sha3(randomMsg);
    // var wholeMsg =  hvalue.substring(2)+pad(64-hvalue.substring(2).length) + round.toString();
    var sigOracle = web3.eth.accounts.sign(Msg, privateKeyOracle);
    // console.log(Msg, v, r, s)
    return [time, price, sigOracle];
}

function submit_dispute_3_wrong_source(){
    var time = 1620361402;
    var source = ['Binance', 'Coinbase'];
    var str_source = ''
    for (var i=0; i < source.length; i++){
        str_source += source[i].toString()
    }
    var Msg = time.toString() + (str_source).toString();
    var sigOracle = web3.eth.accounts.sign(Msg, privateKeyOracle);
    // console.log(Msg, v, r, s)
    return [time, (str_source).toString(), sigOracle];
}


function submit_dispute_4_wrong_methodology(){
    var time = 1620361402;
    var price_dispute = [1001, 1002, 1003];
    var str_price = ''
    for (var i=0; i < price_dispute.length; i++){
        str_price += price_dispute[i].toString()
    }
    var Msg = time.toString() + parseInt(str_price).toString(16);
    var sigOracle = web3.eth.accounts.sign(Msg, privateKeyOracle);
    return [time, parseInt(str_price).toString(16), sigOracle];
}


function submit_dispute_5_slow_reaction(){
    var time = 1620361402;
    var time_rapid = 1620361623;
    var Msg = time.toString() + time_rapid.toString();
    var sigOracle = web3.eth.accounts.sign(Msg, privateKeyOracle);
    return [time, time_rapid, sigOracle];
}

module.exports.submit_dispute_1_late_report = submit_dispute_1_late_report;
module.exports.submit_dispute_2_high_deviation = submit_dispute_2_high_deviation;
module.exports.submit_dispute_3_wrong_source = submit_dispute_3_wrong_source;
module.exports.submit_dispute_4_wrong_methodology = submit_dispute_4_wrong_methodology;
module.exports.submit_dispute_5_slow_reaction = submit_dispute_5_slow_reaction;
