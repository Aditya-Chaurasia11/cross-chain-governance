import React, { useEffect, useState } from "react";
import "./proposalCard.css";
import VoteNow from "./VoteNow";
import TimeLeft from "./TimeLeft";
import Chip from "@mui/material/Chip";

const ProposalCard = ({ data }) => {
  console.log("data", data);
  return (
    <div className="proposalCard_container">
      <div className="proposalCard_container_upper">
        <h2>Proposal - {Number(data?.id) }</h2>
        {data?.deadline > Math.floor(Date.now() / 1000) ? (
          <TimeLeft unixTimestamp={data?.deadline} />
        ) : (
          <>
            {Number(data?.votesAgainst) === Number(data?.votesFor) ? (
              <Chip label="Draw" sx={{ color: "white" }} variant="outlined" />
            ) : Number(data?.votesAgainst) > Number(data?.votesFor) ? (
              <Chip label="Rejected" color="error" />
            ) : (
              <Chip label="Accepted" color="success" />
            )}
          </>
        )}
      </div>
      <div className="proposalCard_container_body">{data?.description}</div>
      <div className="proposalCard_container_bottom">
        <button className="viewDetail">
          <VoteNow name={"View Detail"} data={data} />
        </button>
        <button className="votenow">
          <VoteNow name={"Vote now"} data={data} />
        </button>
      </div>
    </div>
  );
};

export default ProposalCard;
