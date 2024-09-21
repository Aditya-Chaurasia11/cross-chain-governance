import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./voteNow.css";
import TextField from "@mui/material/TextField";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { useEquito } from "@/components/providers/equito/equito-provider";
import { chains } from "@/lib/chains.ts";
import { getBlock, waitForTransactionReceipt } from "@wagmi/core";
import { parseEventLogs } from "viem";
import { routerAbi } from "@equito-sdk/evm";
import { useApprove } from "@/components/providers/equito/use-approve";
import GovernanceABI from "@/abi/GoveranceABI.jsx";
import { config } from "@/lib/wagmi";
import { getChainId } from "@wagmi/core";
import { useReadContract } from "wagmi";
import { generateHash } from "@equito-sdk/viem";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TimeLeft from "./TimeLeft";
import { Chip } from "@mui/material";

const VoteNow = ({ name, data }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [accept, setAccept] = useState();
  const [iswait, setiswait] = useState(false);
  const [proposalTitle, setproposalTitle] = useState("");
  const [proposalDes, setproposalDes] = useState("");
  const [propList, setPropList] = useState([]);
  const [days, setDays] = useState(Number);
  const [open, setOpen] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const approve = useApprove();
  const chainId = getChainId(config);
  const { switchChainAsync } = useSwitchChain();

  console.log("current chainId : ", chainId);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log(data);

  const printFieldValues = () => {
    console.log("Video Name:", videoName);
    console.log("Description:", videoDesc);
  };

  const sourceChain = chains.filter(
    (chain) => chain.definition.id == chainId
  )[0];

  const { data: getFee } = useReadContract({
    address: sourceChain?.RouterContract,
    abi: routerAbi,
    functionName: "getFee",
    args: [address],
    chainId: sourceChain?.definition.id,
  });

  console.log("getFee", getFee);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (accept !== false && accept !== true) {
      toast.warn(`Select either accept or reject`, {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
      });
      return;
    }
    if (data?.deadline < Math.floor(Date.now() / 1000)) {
      toast.error(`Voting is over`, {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
      });
      return;
    }

    printFieldValues();
    console.log("sourcechain", sourceChain);

    console.log("data", {
      address: sourceChain?.GovernanceContract,
      abi: GovernanceABI,
      functionName: "vote",
      args: [address, data?.id, true],
      chainId: sourceChain?.definition?.id,
    });

    try {
      const hash = await writeContractAsync({
        address: sourceChain?.GovernanceContract,
        abi: GovernanceABI,
        functionName: "vote",
        args: [address, data?.id, accept],
        chainId: sourceChain?.definition?.id,
        value: sourceChain?.definition?.id === 11155111 ? undefined : getFee,
      });

      const sepoliachain = chains.filter(
        (chain) => chain.definition.id == 11155111
      )[0];

      if (sourceChain?.definition.id === sepoliachain?.definition.id) {
        handleClose();
        toast.info(`Voted successfully`, {
          position: "top-right",
          autoClose: 3000,
          closeOnClick: true,
        });
        return;
      }

      const sendReceipt = await waitForTransactionReceipt(config, {
        hash: hash,
        chainId: sourceChain?.definition.id,
      });

      console.log("Send Receipt:", sendReceipt);

      const sentMessage = parseEventLogs({
        abi: routerAbi,
        logs: sendReceipt?.logs,
      }).flatMap(({ eventName, args }) =>
        eventName === "MessageSendRequested" ? [args] : []
      )[0];

      console.log("sentmessage", sentMessage);

      console.log(config);
      console.log(sourceChain?.definition.id);
      console.log(sendReceipt.blockNumber);
      console.log("sentPingTimestamp", {
        chainId: sourceChain?.definition.id,
        blockNumber: sendReceipt?.blockNumber,
      });

      const timestamp = await getBlock(config, {
        chainId: sourceChain?.definition.id,
        blockNumber: sendReceipt?.blockNumber,
      });

      console.log(timestamp);

      const sentPingTimestamp = timestamp?.timestamp;
      console.log("sentPingTimestamp", sentPingTimestamp);
      console.log("msg", sentMessage.message);

      const { proof } = await approve.execute({
        messageHash: generateHash(sentMessage.message),
        fromTimestamp: Number(sentPingTimestamp),
        chainSelector: sourceChain?.chainSelector,
      });
      console.log("proof", proof);

      await switchChainAsync({ chainId: sepoliachain?.definition.id });

      console.log("hash1", {
        address: sepoliachain?.RouterContract,
        abi: routerAbi,
        functionName: "deliverAndExecuteMessage",
        args: [sentMessage.message, sentMessage.messageData, BigInt(0), proof],
        chainId: sepoliachain?.definition.id,
      });

      try {
        const hash1 = await writeContractAsync({
          address: sepoliachain?.RouterContract,
          abi: routerAbi,
          functionName: "deliverAndExecuteMessage",
          args: [
            sentMessage.message,
            sentMessage.messageData,
            BigInt(0),
            proof,
          ],
          chainId: sepoliachain?.definition.id,
        });
        toast.info(`Voted successfully`, {
          position: "top-right",
          autoClose: 3000,
          closeOnClick: true,
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error.message);

      if (error?.message?.includes("user Already Voted")) {
        toast.error(`You have already voted`, {
          position: "bottom-right",
          autoClose: 3000,
          closeOnClick: true,
        });
      }
      if (
        error?.message?.includes(
          "you dont have permission to participate in governance"
        )
      ) {
        toast.error(
          `You don't have permission. Click on 'Mint NFT' to get permission.`,
          {
            position: "bottom-right",
            autoClose: 3000,
            closeOnClick: true,
          }
        );
      }
    }

    handleClose();
  };

  return (
    <div>
      <button onClick={handleClickOpen}>{name}</button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>
            <div className="voteNow_title">
              <h2>Proposal - {Number(data?.id) }</h2>
              <p>
                {data?.deadline > Math.floor(Date.now() / 1000) ? (
                  <TimeLeft unixTimestamp={data?.deadline} />
                ) : (
                  <>
                    {Number(data?.votesAgainst) === Number(data?.votesFor) ? (
                      <Chip label="Draw" />
                    ) : Number(data?.votesAgainst) > Number(data?.votesFor) ? (
                      <Chip label="Rejected" color="error" />
                    ) : (
                      <Chip label="Accepted" color="success" />
                    )}
                  </>
                )}
              </p>
            </div>
          </DialogTitle>
          <DialogContent>
            <p className="voteNow_desc">{data?.description}</p>
            <div className="voteNow_time">
              {/* <h2>Start - 12May 6:30PM</h2> */}
              <div
                className={`accept_button_card ${
                  accept === true ? "accept_active" : ""
                }`}
                onClick={() => setAccept(true)}
              >
                <CheckIcon sx={{ mr: "7px" }} /> ACCEPT
              </div>
              <div
                className={`reject_button_card ${
                  accept === false ? "reject_active" : ""
                }`}
                onClick={() => setAccept(false)}
              >
                <CloseIcon sx={{ mr: "7px" }} /> REJECT
              </div>
              {/* <h2>End - 12May 6:30PM</h2> */}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Voting..." : "Vote now"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default VoteNow;
