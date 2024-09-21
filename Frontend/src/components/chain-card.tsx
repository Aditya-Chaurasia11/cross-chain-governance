// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import ChainSelect from "./chain-select";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { useAccount } from "wagmi";
// import { usePingPong } from "./providers/ping-pong/ping-pong-provider";
// import { formatUnits } from "viem";
// import { Skeleton } from "./ui/skeleton";
// import { ChainDirection, useEquito } from "./providers/equito/equito-provider";

// type ChainCardProps = {
//   mode: ChainDirection;
// };

// export const ChainCard = ({ mode }: ChainCardProps) => {
//   const { pingMessage, setPingMessage, pongMessage, status, pingFee, pongFee } =
//     usePingPong();
//   const { address } = useAccount();
//   const { chain } = useEquito()[mode];

//   const onInput = mode === "from" ? setPingMessage : undefined;
//   const cardTitle = `${mode === "from" ? "Source" : "Destination"} Chain`;
//   const value =
//     mode === "from"
//       ? pingMessage
//       : pongMessage
//       ? pongMessage
//       : "Waiting for ping...";
//   const label = `${mode === "from" ? "Ping" : "Pong"} Message`;

//   const nativeCurrency = chain?.definition.nativeCurrency.symbol;
//   const transactionFee = (mode === "from" ? pingFee : pongFee).fee;
//   const isTransactionFeeLoading = (mode === "from" ? pingFee : pongFee)
//     .isLoading;

//   const isProcessing =
//     status !== "isIdle" && status !== "isError" && status !== "isSuccess";

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{cardTitle}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form>
//           <div className="grid w-full items-center gap-6">
//             <div className="flex flex-col gap-2">
//               <ChainSelect mode={mode} disabled={isProcessing || !address} />
//               {isTransactionFeeLoading ? (
//                 <Skeleton className="w-full h-5" />
//               ) : (
//                 <p className="text-muted-foreground text-sm h-5">
//                   {!chain
//                     ? ""
//                     : transactionFee === undefined
//                     ? "Fee not found"
//                     : `Fee: ${Number(formatUnits(transactionFee, 18)).toFixed(
//                         8
//                       )} ${nativeCurrency}`}
//                 </p>
//               )}
//             </div>
//             <div className="flex flex-col gap-4">
//               <Label htmlFor="ping">{label}</Label>
//               <Input
//                 id="ping"
//                 value={value}
//                 placeholder="Write your message..."
//                 onChange={({ target: { value } }) => onInput?.(value)}
//                 readOnly={mode === "to" || isProcessing}
//                 disabled={mode === "to" || isProcessing}
//                 variant={mode === "to" ? "readonly" : "default"}
//               />
//             </div>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };
