pragma solidity ^0.4.24;
import "./strings.sol";
pragma experimental "ABIEncoderV2";


library verify {
    using strings for *;

    function bytesToBytes32(bytes b, uint offset) private pure returns (bytes32) {
        bytes32 out;
        for (uint i = 0; i < 32; i++) {
            out |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
        }
        return out;
    }

    function conver(bytes call_data) private view returns (string){
        bytes memory data = new bytes(call_data.length);
        for (uint i = 0; i < call_data.length; i++) {
            data[i] = call_data[i];
        }
        return bytesArrayToString(data);
    }

    function bytesArrayToString(bytes memory _bytes) private returns (string) {
        return string(_bytes);
    } //

    function recursi(bytes call_data, uint i) private returns (string){
        return bytes32string(bytesToBytes32(call_data, i));
    } 

    function bytesToBytes32(bytes memory source) private pure returns (bytes32 result) {
        assembly { 
            //mload(p) -->  mem[p..(p+32)) 
            result := mload(add(source, 32))
        }
    }

    function char(byte b) private returns (byte c) {
        if (b < 10) 
            return byte(uint8(b) + 0x30);
        else 
            return byte(uint8(b) + 0x57);
    }

    function bytes32string(bytes32 b32) public returns (string out) {
        bytes memory s = new bytes(64);
        for (var i = 0; i < 32; i++) {
            byte b = byte(b32[i]);
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[i*2] = char(hi);
            s[i*2+1] = char(lo);            
        }
        out = string(s);
    }

    function uint2str(uint i) public returns (string memory){
        if (i == 0) return "0";
        uint j = i;
        uint length;
        while (j != 0){
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint k = length - 1;
        while (i != 0){
            bstr[k--] = byte(48 + i % 10);
            i /= 10;
        }
        return string(bstr);
    }

    function toBytes(address x) private returns (bytes b) {
        b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    }

    function toHexDigit(uint8 d) pure internal returns (byte) {                                                                                      
        if (0 <= d && d <= 9) {                                                                                                                      
            return byte(uint8(byte('0')) + d);                                                                                                       
        } else if (10 <= uint8(d) && uint8(d) <= 15) {                                                                                               
            return byte(uint8(byte('a')) + d - 10);                                                                                                  
        }                                                                                                                                            
        revert();                                                                                                                                    
    }  

    function fromCode(bytes4 code) private view returns (string) {                                                                                    
        bytes memory result = new bytes(10);                                                                                                         
        result[0] = byte('0');
        result[1] = byte('x');
        for (uint i=0; i<4; ++i) {
            result[2*i+2] = toHexDigit(uint8(code[i])/16);
            result[2*i+3] = toHexDigit(uint8(code[i])%16);
        }
        return string(result);
    }

    function convertBytesToBytes4(bytes inBytes) returns (bytes8 outBytes4) {
        if (inBytes.length == 0) {
            return 0x0;
        }

        assembly {
            outBytes4 := mload(add(inBytes, 32))
        }
    }

    struct Data {
        string  len_message;
        string  whole;
        string  first_;
        uint index;
    }

    function verify_punish(Data data, uint behavior, uint time, uint time_rapid, uint price, bytes prices, bytes sources, byte _v, bytes32 _r, bytes32 _s) public returns (address) {
        if (behavior == 1) {
            data.first_ = uint2str(time).toSlice().concat(uint2str(price).toSlice());
            data.len_message = uint2str(data.first_.toSlice().len());
        }else if (behavior == 2) {
            data.first_ = uint2str(time).toSlice().concat(uint2str(price).toSlice());
            data.len_message = uint2str(data.first_.toSlice().len());
            // data.second_ = data.first_.toSlice().concat(uint2str(reaction).toSlice());
            // data.first_ = bytes32string(hvalue).toSlice().concat(uint2str(round).toSlice());
            // data.third_ = bytes32string(keccak256(data.second_)).toSlice().concat(uint2str(round).toSlice());
            // data.second_ = data.first_.toSlice().concat(uint2str(round).toSlice());
        }else if (behavior == 3) {
            data.first_ = uint2str(time).toSlice().concat(bytesArrayToString(sources).toSlice());
            data.len_message = uint2str(data.first_.toSlice().len());
        }else if (behavior == 4) {
            data.first_ = uint2str(time).toSlice().concat(bytesArrayToString(prices).toSlice());
            data.len_message = uint2str(data.first_.toSlice().len());
        }else if (behavior == 5) {
            data.first_ = uint2str(time).toSlice().concat(uint2str(time_rapid).toSlice());
            data.len_message = uint2str(data.first_.toSlice().len());
        }
        else {
            revert();
        }
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.first_.toSlice());  
        // return data.whole;
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }

    function verify_dispute(Data data, uint behavior, uint time, uint time_rapid, uint price, bytes prices, bytes sources, byte _v, bytes32 _r, bytes32 _s) public returns (address) {
        if (behavior == 1) {
            data.first_ = uint2str(time).toSlice().concat(uint2str(price).toSlice());
            data.len_message = uint2str(data.first_.toSlice().len());
            
        }else if (behavior == 2) {
            data.first_ = uint2str(time).toSlice().concat(uint2str(price).toSlice());
            // data.first_ = data.first_.toSlice().concat(uint2str(reaction).toSlice());
            // data.first_ = bytes32string(hvalue).toSlice().concat(uint2str(round).toSlice());
            // data.third_ = bytes32string(keccak256(data.second_)).toSlice().concat(uint2str(round).toSlice());
            // data.second_ = data.first_.toSlice().concat(uint2str(round).toSlice());
            data.len_message = uint2str(data.first_.toSlice().len());
        }else if (behavior == 3) {
            data.first_ = uint2str(time).toSlice().concat(bytesArrayToString(sources).toSlice());
            data.len_message = uint2str(data.first_.toSlice().len());
        }else if (behavior == 4) {
            data.first_ = uint2str(time).toSlice().concat(bytesArrayToString(prices).toSlice());
            data.len_message = uint2str(data.first_.toSlice().len());
        }else if (behavior == 5) {
            data.first_ = uint2str(time).toSlice().concat(uint2str(time_rapid).toSlice());
            data.len_message = uint2str(data.first_.toSlice().len());
        }
        else {
            revert();
        }
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.first_.toSlice());  
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }

    function verify_resolve(Data data, uint behavior, uint decision, byte _v, bytes32 _r, bytes32 _s) public returns (address) {
        data.first_ = uint2str(behavior).toSlice().concat(uint2str(decision).toSlice());
        data.len_message = uint2str(data.first_.toSlice().len());
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.first_.toSlice());    
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }


    
    // function verifyidentity(Data data, uint A, uint B, uint round, uint random, byte _v, bytes32 _r, bytes32 _s) public returns (address) {
    //     data.first_ = uint2str(A).toSlice().concat(uint2str(B).toSlice());
    //     data.second_ = data.first_.toSlice().concat(uint2str(random).toSlice());
    //     // data.first_ = bytes32string(hvalue).toSlice().concat(uint2str(round).toSlice());
    //     data.third_ = bytes32string(keccak256(data.second_)).toSlice().concat(uint2str(round).toSlice());
    //     // data.second_ = data.first_.toSlice().concat(uint2str(round).toSlice());
    //     data.len_message = uint2str(data.third_.toSlice().len());
    //     string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
    //     data.whole = pref1.toSlice().concat(data.third_.toSlice());    
    //     return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    // }

    // function verify2identity(Data data, uint A, uint B, uint round, uint random, byte _v, bytes32 _r, bytes32 _s) public returns (string) {
    //     data.first_ = uint2str(A).toSlice().concat(uint2str(B).toSlice());
    //     data.second_ = data.first_.toSlice().concat(uint2str(random).toSlice());
    //     // data.first_ = bytes32string(hvalue).toSlice().concat(uint2str(round).toSlice());
    //     data.third_ = bytes32string(keccak256(data.second_)).toSlice().concat(uint2str(round).toSlice());
    //     // data.second_ = data.first_.toSlice().concat(uint2str(round).toSlice());
    //     data.len_message = uint2str(data.third_.toSlice().len());
    //     string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
    //     data.whole = pref1.toSlice().concat(data.third_.toSlice());    
    //     // return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    //     return data.whole;
    // }

    // function verifytower(Data data, bytes32 Hvalue, uint round, byte _v, bytes32 _r, bytes32 _s) public returns (address) {
    //     data.first_ = bytes32string(Hvalue).toSlice().concat(uint2str(round).toSlice());
    //     // data.second_ = data.first_.toSlice().concat(uint2str(round).toSlice());
    //     data.len_message = uint2str(data.first_.toSlice().len());
    //     string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
    //     data.whole = pref1.toSlice().concat(data.first_.toSlice());
    //     // return data.whole;
    //     return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    // }

}
