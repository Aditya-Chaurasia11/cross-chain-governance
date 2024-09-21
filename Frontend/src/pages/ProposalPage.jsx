import React, { useEffect, useState } from "react";
import CreateProposal from "../components/CreateProposal";
import "./proposalPage.css";
import ProposalCard from "../components/ProposalCard";
import ChainSelect from "@/components/chain-select";
import { useEquito } from "@/components/providers/equito/equito-provider";
// import "./addCollateral.css";
import { formatUnits, parseEther, parseEventLogs, parseUnits } from "viem";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import GoveranceABI from "../abi/GoveranceABI";
import { config } from "@/lib/wagmi";
import { getChainId } from "@wagmi/core";
import GovernanceABI from "@/abi/GoveranceABI.jsx";

// import "./proposalPage.css";

const ProposalPage = () => {
  const [proList, setproList] = useState([]);
  const { address } = useAccount();
  console.log(address);
  const chainId = getChainId(config);
  console.log(chainId);

  const { data: proposal } = useReadContract({
    address: "0x0dC6e902e9c30755609d898b7B859b2DCd64457F",
    abi: GovernanceABI,
    functionName: "getAllProposals",
    chainId: 11155111,
  });

  console.log("getAllProposals", proposal);
  // setproList(proposal);

  // const handleGallerynavigation = () => {};
  return (
    <div className="proposalPage_container">
      <div className="proposalPage_container_upper">
        <h2>All Proposal</h2>
        <CreateProposal />
      </div>

      <div className="proposalPage_container_lower">
        {proposal?.length !== 0 ? (
          <div className="proposalPage_Card_container">
            {proposal?.map((k) => (
              <ProposalCard data={k} />
            ))}
           
          </div>
        ) : (
          <div className="proposalPage_container_lower_card">
            <h3>No proposal yet. Click on Create Proposal to create new.</h3>
            {/* <button
                className="proposalPage_container_lower_card_button"
                onClick={handleGallerynavigation}
              >
                Create new
              </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalPage;
