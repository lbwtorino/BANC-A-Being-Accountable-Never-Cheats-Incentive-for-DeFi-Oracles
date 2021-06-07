// pragma solidity >=0.4.21 <0.6.0;
pragma solidity ^0.4.3;
import "./imported/verify.sol";
// import "./imported/strings.sol";
pragma experimental "ABIEncoderV2";
contract Incentive {

    verify.Data data;
    using verify for verify.Data;
    address public owner;
    struct Oracle {
        uint balance;
        address manifest;
        uint isAuthorized;
        uint tag;
    }
    mapping(address=>Oracle) oracles;

    mapping(address=>uint) dispute_window;

    struct Resolve {
        uint safety_window;
        uint linear_window;
    }
    mapping(address=>Resolve) resolves;


    struct Watchtower {
        uint balance;
        uint isAuthorized;
    }
    mapping(address=>Watchtower) watchtowers;

    struct Accountability {
        mapping(address=>Respond) watchtowers;
        uint[] decisions;
    }
    struct Respond {
        bool isRespond;
        uint percentage;
    }
    mapping(address=>Accountability) accountabilities;

    uint consortium = 0;
    address[] watchtower_addr;


    function Incentive() public {
        owner = msg.sender;
    }

    function oracle_register(address manifest) payable {
        oracles[msg.sender] = Oracle(msg.value, manifest, 1, 1);
        dispute_window[msg.sender] = 0;
    }

    function watchtower_register() payable {
        watchtowers[msg.sender] = Watchtower(msg.value, 1);
        consortium += 1;
        watchtower_addr.push(msg.sender);
    }


    uint test1;
    address test2;
    address test3;
    uint test_dispute;
    uint test_resolve;
    string punish_list;

    function getInfor() public returns (uint, address, address, uint, uint, string){
       return (test1, test2, test3, test_dispute, test_resolve, punish_list);
    }

    event Punish(address oracle, uint behavior, uint time, uint time_rapid, uint price, bytes prices, bytes sources);
    event Dispute(address oracle, uint behavior, uint time, uint time_rapid, uint price, bytes prices, bytes sources);

    function punish(address oracle, uint behavior, uint time, uint time_rapid, uint price, bytes prices, bytes sources, byte _v, bytes32 _r, bytes32 _s) public {
        // assert(oracles[oracle].isAuthorized == 1);
        // assert(oracles[oracle].tag == 1);
        assert(msg.sender == data.verify_punish(behavior, time, time_rapid, price, prices, sources, _v,  _r, _s));
        oracles[oracle].isAuthorized = 0;
        oracles[oracle].tag = 3;
        test1 = 555;
        test2 = msg.sender;
        dispute_window[oracle] = now + 3600; 
        emit Punish(oracle, behavior, time, time_rapid, price, prices, sources);
    }

    function dispute(uint behavior, uint time, uint time_rapid, uint price, bytes prices, bytes sources, byte _v, bytes32 _r, bytes32 _s) public {
        // assert(oracles[msg.sender].tag == 3 && oracles[msg.sender].isAuthorized == 0);
        // assert(now <= dispute_window[msg.sender]);
        assert(msg.sender == data.verify_dispute(behavior, time, time_rapid, price, prices, sources, _v,  _r, _s));
        oracles[msg.sender].tag = 5;
        resolves[msg.sender] = Resolve(now + 3600, now + 7200);
        test_dispute = 666;
        emit Dispute(msg.sender, behavior, time, time_rapid, price, prices, sources);
    }

    function resolve(address oracle, uint behavior, uint decision, byte _v, bytes32 _r, bytes32 _s) public {
        // assert(oracles[oracle].isAuthorized == 0);
        // assert(oracles[oracle].tag == 5 || (oracles[oracle].tag == 3 && now > dispute_window[oracle]));
        // assert(watchtowers[msg.sender].isAuthorized == 1);
        assert(msg.sender == data.verify_resolve(behavior, decision, _v,  _r, _s));
        if(now < resolves[oracle].safety_window) {
            accountabilities[oracle].watchtowers[msg.sender] = Respond(true, 0);
            accountabilities[oracle].decisions.push(decision); 
        }else if (now >= resolves[oracle].safety_window && now < resolves[oracle].linear_window) {
            uint percentage = (now - resolves[oracle].safety_window) / 300; // linearly punish in every 5 mins
            accountabilities[oracle].watchtowers[msg.sender] = Respond(true, percentage);
            accountabilities[oracle].decisions.push(decision); 
        }else {
            accountabilities[oracle].watchtowers[msg.sender] = Respond(false, 100);
        }
        if (majority_helper(oracle) == true) {
            if(voting_helper(oracle) == true) {
                oracles[oracle].tag = 1;
                oracles[oracle].isAuthorized = 1;
                dispute_window[oracle] = 0;
                resolves[msg.sender] = Resolve(0, 0);
                punish_watchtower(oracle);
                delete accountabilities[oracle];
            }else {
                owner.transfer(oracles[oracle].balance);
                oracles[oracle].balance = 0;
                oracles[oracle].isAuthorized = 0;
                punish_watchtower(oracle);
                delete accountabilities[oracle];
            }
        }
        test_resolve = 777;
    }
    
    function punish_watchtower(address oracle) private  {
        uint consortium_size = watchtower_addr.length;
        for (uint i=0; i<consortium_size; i++) {
            if(accountabilities[oracle].watchtowers[watchtower_addr[i]].isRespond == true && accountabilities[oracle].watchtowers[watchtower_addr[i]].percentage >= 0) {
                owner.transfer(accountabilities[oracle].watchtowers[watchtower_addr[i]].percentage);
                watchtowers[watchtower_addr[i]].balance -= accountabilities[oracle].watchtowers[watchtower_addr[i]].percentage;
            }else {
                owner.transfer( watchtowers[watchtower_addr[i]].balance);
                watchtowers[watchtower_addr[i]].balance = 0;
            }
        }
    }

    function voting_helper(address oracle) public returns (bool){
        uint votes = accountabilities[oracle].decisions.length;
        uint threshold = 0;
        for (uint i=0; i<votes; i++) {
            if(accountabilities[oracle].decisions[i] == 1) {
                threshold += 1;
            }
            if(threshold >= 1) {
                return true;
            }
        }
        return false;
    }

    function majority_helper(address oracle) public returns (bool){
        uint votes = accountabilities[oracle].decisions.length;
        if(votes >= 1){
            return true;
        }
        return false;
    }
}
