// pragma solidity >=0.4.21 <0.6.0;
pragma solidity ^0.4.3;
import "./imported/verify.sol";
// import "./imported/strings.sol";
pragma experimental "ABIEncoderV2";
contract Manifest {

    address public owner;
    uint frequency;
    uint deviation;
    struct Sources {
        mapping (uint => bytes32) source_name;
        uint index;
    }
    Sources src;
    
    struct Methodology {
        uint time_range;
        bytes32 method;
    }
    Methodology mtd;

    uint reaction_window;


    function Manifest() public {
        owner = msg.sender;
        frequency = 10; // 10 minutes
        deviation = 5; // 5%
        src.source_name[0] = "Binance";
        src.source_name[1] = "CoinBase";
        src.index = 2;
        mtd.time_range = 0; // real-time prices
        mtd.method = "median";
        reaction_window = 5; // 5 minutes
    }

    function set_frequency(uint _frequency) public{
        assert(msg.sender == owner);
        frequency = _frequency;
    }

    function set_deviation(uint _deviation) public{
        assert(msg.sender == owner);
        deviation = _deviation;
    }

    function set_source(bytes32[] _sources) public{
        assert(msg.sender == owner);
        for(uint i = 0; i < _sources.length; i++) {
            src.source_name[src.index] =  _sources[i];
            src.index += 1;
        }
    }

    function set_methodology(uint _time_range, bytes32 _method) public{
        assert(msg.sender == owner);
        mtd.time_range = _time_range;
        mtd.method = _method;
    }

    function set_reaction_window(uint _reaction_window) public{
        assert(msg.sender == owner);
        reaction_window = _reaction_window;
    }

    function get_frequency() public returns (uint){
        return frequency;
    }

    function get_deviation() public returns (uint){
        return deviation;
    }

    function get_source() public returns (bytes32[]){
        bytes32[] sources;
        for(uint i = 0; i < src.index; i++) {
            sources.push(src.source_name[i]);
        }
        return sources;
    }

    function get_methodology() public returns (uint, bytes32){
        return (mtd.time_range, mtd.method);
    }

    function get_reaction_window() public returns (uint){
        return reaction_window;
    }

    function getInfor() public returns (uint, uint, bytes32, bytes32, uint, uint, bytes32, uint){
       return (frequency, deviation, src.source_name[0], src.source_name[1], src.index, mtd.time_range, mtd.method, reaction_window);
    }
}
