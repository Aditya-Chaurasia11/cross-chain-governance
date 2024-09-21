// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {EquitoApp} from "./EquitoApp.sol";
import {bytes64, EquitoMessage} from "./libraries/EquitoMessageLibrary.sol";
import {IRouter} from "./interfaces/IRouter.sol";
import {TransferHelper} from "./libraries/TransferHelper.sol";
import {Errors} from "./libraries/Errors.sol";
import {EquitoMessageLibrary} from "./libraries/EquitoMessageLibrary.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract Governance is EquitoApp  {


    uint256 public proposalCount;
    uint256 public voteThreshold = 3;
    uint256 public GovernanceChainSelector;
    IERC721 public GovernanceToken;
    

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        uint256 deadline;
    }


    mapping (uint256 => Proposal) public proposals;
    mapping (uint256 => mapping (address =>bool)) userVoteDetails;


    constructor(address _router , uint _governanceChainSelector , address _governanceToken) EquitoApp(_router){
        GovernanceChainSelector = _governanceChainSelector;
        GovernanceToken = IERC721(_governanceToken);
    }

    function createProposal(
            address _proposer,
            string  memory _description,
            uint256 deadline_in_days
        ) public payable {
            
            if(router.chainSelector() == GovernanceChainSelector){
                require(GovernanceToken.balanceOf(_proposer) > 0,"you dont have permission to participate in governance");
                proposalCount++;
                Proposal memory proposal = Proposal({
                        id:proposalCount,
                        proposer:_proposer,
                        description:_description,
                        votesFor:0,
                        votesAgainst:0,
                        executed:false,
                        deadline: block.timestamp + deadline_in_days * 1 days
                });
                proposals[proposalCount] = proposal;
            }else{
                bytes1 operationID = 0x01;
                bytes memory data = abi.encode( operationID , _proposer,_description,deadline_in_days);
                bytes32 messageHash = router.sendMessage{value: msg.value}(
                    getPeer(GovernanceChainSelector),
                    GovernanceChainSelector,
                    data
                );
            }
    }

    function vote (address user,uint256 proposalId, bool isAcceptedProposal)  public payable{
        if(router.chainSelector() == GovernanceChainSelector){
        require(!userVoteDetails[proposalId][user] , "user Already Voted");
        require(block.timestamp <= proposals[proposalId].deadline,"Deadline is Over");
        require(GovernanceToken.balanceOf(user) > 0,"you dont have permission to participate in governance");
            userVoteDetails[proposalId][user] = true ;
            if(isAcceptedProposal){
                proposals[proposalId].votesFor ++;
            }else{
                proposals[proposalId].votesAgainst ++;
            }
        }else{
                bytes1 operationID = 0x02;
                bytes memory data = abi.encode( operationID , msg.sender,proposalId,isAcceptedProposal);
                bytes32 messageHash = router.sendMessage{value: msg.value}(
                    getPeer(GovernanceChainSelector),
                    GovernanceChainSelector,
                    data
                );
        }
    }

    function _receiveMessageFromPeer(
        EquitoMessage calldata message, 
        bytes calldata messageData
    ) internal override {
        bytes1 operationID = messageData[0];

        if(operationID == 0x01){
            (,address _proposer,string memory _description,uint deadline_in_days) = abi.decode(messageData,(bytes1 , address ,string ,uint));
            createProposal( _proposer, _description, deadline_in_days);
        }else if (operationID == 0x02){
            (,address user,uint256 proposalId,bool isAcceptedProposal) = abi.decode(messageData,(bytes1,address,uint256,bool));
            vote(user, proposalId, isAcceptedProposal);
        }
    }

    function setPeers(uint[] memory chainSelectors,address[] memory addresss) public {
        bytes64[] memory bytesaddress = new bytes64[](addresss.length);
        require(chainSelectors.length == addresss.length);

        for(uint i=0;i<addresss.length;i++){
            bytesaddress[i] = EquitoMessageLibrary.addressToBytes64(addresss[i]);
        }
        _setPeers(chainSelectors, bytesaddress);
    }

    function getAllProposals() public view returns(Proposal[] memory){
        Proposal[] memory ret = new Proposal[](proposalCount);

        for(uint i=1;i<proposalCount+1;i++){
            ret[i-1] = proposals[i];
        }
        return ret;
    }

}