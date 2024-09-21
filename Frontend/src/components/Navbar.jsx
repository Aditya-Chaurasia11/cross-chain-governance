import { NavLink } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./navbar.css";
import { useWriteContract, useSwitchChain, useAccount } from "wagmi";
import { chains } from "@/lib/chains.ts";
import NFTABI from "../abi/NFTABI";

export default function Navbar() {
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const { address } = useAccount();
  console.log(address);

  const handleclick = async () => {
    const sepoliachain = chains.filter(
      (chain) => chain.definition.id == 11155111
    )[0];
    console.log(sepoliachain);

    await switchChainAsync({ chainId: sepoliachain?.definition?.id });
    writeContractAsync({
      address: "0x9D0eFAE37Ef982Ce8753af9EE0c3670cAB9AaCB2",
      abi: NFTABI,
      functionName: "safeMint",
      args: [address],
      chainId: sepoliachain?.definition?.id,
    });
  };
  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <NavLink to="/">
            <h2>CrossGov</h2>
          </NavLink>
        </div>
      </div>

      <div className="gpt3__navbar-sign">
        {/* <NavLink
          to="/add-collateral"
          className={({ isActive }) =>
            isActive
              ? "active-link hover:underline"
              : "inactive-link  hover:underline"
          }
        >
          Add Collateral
        </NavLink> */}
        <button className="navbar_mint_nft" onClick={handleclick}>
          Mint NFT
        </button>
        <ConnectButton className="right" />
      </div>
    </div>
  );
}
