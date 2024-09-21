import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
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

const CreateProposal = () => {
  const [iswait, setiswait] = useState(false);
  const [proposalTitle, setproposalTitle] = useState("");
  const [proposalDes, setproposalDes] = useState("");
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

    console.log("sourcechain", sourceChain);

    try {
      console.log("data", {
        address: sourceChain?.GovernanceContract,
        abi: GovernanceABI,
        functionName: "createProposal",
        args: [address, proposalDes, Number(days)],
        chainId: sourceChain?.definition?.id,
      });

      const hash = await writeContractAsync({
        address: sourceChain?.GovernanceContract,
        abi: GovernanceABI,
        functionName: "createProposal",
        args: [address, proposalDes, days],
        chainId: sourceChain?.definition?.id,
        value: sourceChain?.definition?.id == 11155111 ? undefined : getFee,
      });

      const sepoliachain = chains.filter(
        (chain) => chain.definition.id == 11155111
      )[0];

      

      if (sourceChain?.definition.id === sepoliachain?.definition.id) {
        toast.info(`Proposal created successfully`, {
          position: "top-right",
          autoClose: 3000,
          closeOnClick: true,
        });
        handleClose();
        return;
      }

      const sendReceipt = await waitForTransactionReceipt(config, {
        hash: hash,
        chainId: sourceChain?.definition.id,
      });

      console.log("Send Receipt:", sendReceipt);

      const sentMessage = await parseEventLogs({
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
        toast.info(`Proposal created successfully`, {
          position: "top-right",
          autoClose: 3000,
          closeOnClick: true,
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error?.message);

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
      <button className="createCollectionButton" onClick={handleClickOpen}>
        Create Proposal
      </button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>Create Proposal</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill out the form to create new proposal.
            </DialogContentText>
            <br />
            <TextField
              required
              margin="dense"
              label="Description of proposal"
              type="text"
              fullWidth
              value={proposalDes}
              minRows={3}
              onChange={(e) => setproposalDes(e.target.value)}
            />

            <TextField
              required
              margin="dense"
              label="Number of days for proposal"
              type="number"
              fullWidth
              value={days}
              minRows={3}
              onChange={(e) => setDays(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={iswait}>
              {iswait ? "transation..." : "create proposal"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateProposal;
