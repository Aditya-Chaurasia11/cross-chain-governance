// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./EquitoApp.sol";
import {EquitoMessageLibrary} from "./libraries/EquitoMessageLibrary.sol";

contract Demo is EquitoApp {

    event PingSent(
        uint256 indexed destinationChainSelector,
        bytes32 messageHash
    );

    event PingReceived(
        uint256 indexed sourceChainSelector,
        bytes32 messageHash
    );

    event PongSent(
        uint256 indexed destinationChainSelector,
        bytes32 messageHash
    );

    event PongReceived(
        uint256 indexed sourceChainSelector,
        bytes32 messageHash
    );

    error RouterAlreadySet();

    error InvalidMessageType();



    string public MSG;
    string public IsPINGorPong;

    constructor(address _router) EquitoApp(_router){}

    function SetPeers(uint256[] memory chainSelectors , address[] memory addresses) public {
        bytes64[] memory addresss = new bytes64[](chainSelectors.length);

        for (uint i = 0 ; i<chainSelectors.length ; i++) {
            addresss[i] = EquitoMessageLibrary.addressToBytes64(addresses[i]);
        }

        _setPeers(chainSelectors, addresss);
    }

    function sendPing(
        uint256 destinationChainSelector,
        string calldata message
    ) external payable {
        bytes memory data = abi.encode("ping", message);

        bytes32 messageHash = router.sendMessage{value: msg.value}(
            getPeer(destinationChainSelector),
            destinationChainSelector,
            data
        );

        emit PingSent(destinationChainSelector, messageHash);
    }

    function _receiveMessageFromPeer(
        EquitoMessage calldata message,
        bytes calldata messageData
    ) internal override {
        MSG = "recieved";
        (string memory messageType, string memory payload) = abi.decode(
            messageData,
            (string, string)
        );

        if (keccak256(bytes(messageType)) == keccak256(bytes("ping"))) {
            MSG = payload;
            IsPINGorPong = "PING";
            emit PingReceived(
                message.sourceChainSelector,
                keccak256(abi.encode(message))
            );

            // send pong
            bytes memory data = abi.encode("pong", payload);
            bytes32 messageHash = router.sendMessage{value: msg.value}(
                getPeer(message.sourceChainSelector),
                message.sourceChainSelector,
                data
            );
            emit PongSent(message.sourceChainSelector, messageHash);
        } else if (keccak256(bytes(messageType)) == keccak256(bytes("pong"))) {
            MSG = payload;
            IsPINGorPong = "PONG";
            emit PongReceived(
                message.sourceChainSelector,
                keccak256(abi.encode(message))
            );
        } else {
            revert InvalidMessageType();
        }
    }

    function _receiveMessageFromNonPeer(
        EquitoMessage calldata message,
        bytes calldata messageData    
    ) internal override {
        MSG = "NON PEER ACCOUNT CALLED" ;
    }

    function getbytes(address x) public pure returns (bytes64 memory) {
        return EquitoMessageLibrary.addressToBytes64(x);
    }

    function getFees () public view returns(uint ){
        return router.getFee(address(this));
    }

}


// sepolia  0xf3D1cD1B49D6CA5DC8164488eBBBaCC3a76b62bE
// blast    0xF7C00F163cC18B85395d1b9d02BBfdbBf38FC8E7

// ["0xf3D1cD1B49D6CA5DC8164488eBBBaCC3a76b62bE","0xF7C00F163cC18B85395d1b9d02BBfdbBf38FC8E7"]