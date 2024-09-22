import React from "react";
import CreateProposal from "../components/CreateProposal";
import "./proposalPage.css";
import ProposalCard from "../components/ProposalCard";
import { useReadContract, useAccount } from "wagmi";
import { config } from "@/lib/wagmi";
import { getChainId } from "@wagmi/core";
import GovernanceABI from "@/abi/GoveranceABI.jsx";

const ProposalPage = () => {
  const { address } = useAccount();
  console.log(address);
  const chainId = getChainId(config);
  console.log(chainId);

  const { data: proposal } = useReadContract({
    address: "0x259C0006d10946347B7e64D3dBEDe83c0FB48A9e",
    abi: GovernanceABI,
    functionName: "getAllProposals",
    chainId: 11155111,
  });

  console.log("getAllProposals", proposal);

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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalPage;
