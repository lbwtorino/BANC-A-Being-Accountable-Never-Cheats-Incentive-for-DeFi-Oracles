var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
PunisherStorage = new LocalStorage('./data/Punisher');

var privateKeyPunisher = PunisherStorage.getItem("private");
var publicKeyPunisher = PunisherStorage.getItem("public");


function pad(num) {
    var str = ''
    for (var i=0; i<num; i++){
        str += '0'
    }
    return str
}

function submit_punishment_1_late_report(){
    var time_punisher = 1620361402;
    var price_punisher = 1001;
    var Msg_punisher = time_punisher.toString() + price_punisher.toString();
    var sigPunisher = web3.eth.accounts.sign(Msg_punisher, privateKeyPunisher);
    return [time_punisher, price_punisher, sigPunisher];
}

function submit_punishment_2_high_deviation(){
    var time_punisher = 1620361402;
    var price_punisher = 1001;
    var reaction_punisher = 3;
    var Msg_punisher = time_punisher.toString() + price_punisher.toString();
    // var privatekeyPunisher = "0xdb5269258a5eb1d3cbdd9cf527c22733e9ff468477af96e53efa306c31829b9a"
    // var hvalue = web3.utils.sha3(randomMsg);
    // var wholeMsg =  hvalue.substring(2)+pad(64-hvalue.substring(2).length) + round.toString();
    var sigPunisher = web3.eth.accounts.sign(Msg_punisher, privateKeyPunisher);
    var v = sigPunisher.v;
    var r = sigPunisher.r;
    var s = sigPunisher.s;
    return [time_punisher, price_punisher, sigPunisher];
}

function toHex(str) {
    var result = '';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }

function submit_punishment_3_wrong_source(){
    var time_punisher = 1620361402;
    var source = ['Binance', 'Coinbase'];
    var str_source = ''
    for (var i=0; i < source.length; i++){
        str_source += source[i].toString()
    }
    // var Msg_punisher = time_punisher.toString() + toHex(str_source).toString();
    var Msg_punisher = time_punisher.toString() + (str_source).toString();
    var sigPunisher = web3.eth.accounts.sign(Msg_punisher, privateKeyPunisher);
    console.log(Msg_punisher)
    return [time_punisher, str_source.toString(), sigPunisher];
}

function submit_punishment_4_wrong_methodology(){
    var time_punisher = 1620361402;
    var price_punisher = [1001, 1002, 1003];
    var str_price = ''
    for (var i=0; i < price_punisher.length; i++){
        str_price += price_punisher[i].toString()
    }
    var Msg_punisher = time_punisher.toString() + parseInt(str_price).toString(16);
    // var privatekeyPunisher = "0xdb5269258a5eb1d3cbdd9cf527c22733e9ff468477af96e53efa306c31829b9a"
    // var hvalue = web3.utils.sha3(randomMsg);
    // var wholeMsg =  hvalue.substring(2)+pad(64-hvalue.substring(2).length) + round.toString();
    var sigPunisher = web3.eth.accounts.sign(Msg_punisher, privateKeyPunisher);
    // console.log(Msg_punisher)
    return [time_punisher, parseInt(str_price).toString(16), sigPunisher];
}

function submit_punishment_5_slow_reaction(){
    var time_punisher = 1620361402;
    var time_rapid = 1620361623;
    var Msg_punisher = time_punisher.toString() + time_rapid.toString();
    var sigPunisher = web3.eth.accounts.sign(Msg_punisher, privateKeyPunisher);
    return [time_punisher, time_rapid, sigPunisher];
}





module.exports.submit_punishment_1_late_report = submit_punishment_1_late_report;
module.exports.submit_punishment_2_high_deviation = submit_punishment_2_high_deviation;
module.exports.submit_punishment_3_wrong_source = submit_punishment_3_wrong_source;
module.exports.submit_punishment_4_wrong_methodology = submit_punishment_4_wrong_methodology;
module.exports.submit_punishment_5_slow_reaction = submit_punishment_5_slow_reaction;
