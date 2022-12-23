import { useState, useEffect } from "react";
import { Web3Button } from "@web3modal/react";
import Web3 from "web3";
import {
	useAccount,
	useBalance,
	useConnect,
	useDisconnect,
	useNetwork,
	useSignMessage,
	useSwitchNetwork,
	useSendTransaction,
	usePrepareSendTransaction,
	usePrepareContractWrite,
	useContractWrite,
} from "wagmi";

function HomePage() {
	const [Connected, setConnected] = useState(false);
	const [message, setMessage] = useState("Connecting to demo dapp");
	const [receiver, setReceiver] = useState("");
	const [amount, setAmount] = useState("");
	const abi = [
		{
			inputs: [
				{ internalType: "string", name: "tokenName", type: "string" },
				{ internalType: "string", name: "tokenSymbol", type: "string" },
				{ internalType: "uint8", name: "tokenDecimals", type: "uint8" },
				{ internalType: "uint256", name: "totalSupply", type: "uint256" },
				{ internalType: "address", name: "tokenOwnerAddress", type: "address" },
			],
			stateMutability: "payable",
			type: "constructor",
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: true, internalType: "address", name: "owner", type: "address" },
				{ indexed: true, internalType: "address", name: "spender", type: "address" },
				{ indexed: false, internalType: "uint256", name: "value", type: "uint256" },
			],
			name: "Approval",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: true, internalType: "address", name: "from", type: "address" },
				{ indexed: true, internalType: "address", name: "to", type: "address" },
				{ indexed: false, internalType: "uint256", name: "value", type: "uint256" },
			],
			name: "Transfer",
			type: "event",
		},
		{
			inputs: [
				{ internalType: "address", name: "owner", type: "address" },
				{ internalType: "address", name: "spender", type: "address" },
			],
			name: "allowance",
			outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{ internalType: "address", name: "spender", type: "address" },
				{ internalType: "uint256", name: "value", type: "uint256" },
			],
			name: "approve",
			outputs: [{ internalType: "bool", name: "", type: "bool" }],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [{ internalType: "address", name: "account", type: "address" }],
			name: "balanceOf",
			outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
			name: "burn",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [],
			name: "decimals",
			outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{ internalType: "address", name: "spender", type: "address" },
				{ internalType: "uint256", name: "subtractedValue", type: "uint256" },
			],
			name: "decreaseAllowance",
			outputs: [{ internalType: "bool", name: "", type: "bool" }],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{ internalType: "address", name: "spender", type: "address" },
				{ internalType: "uint256", name: "addedValue", type: "uint256" },
			],
			name: "increaseAllowance",
			outputs: [{ internalType: "bool", name: "", type: "bool" }],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [],
			name: "name",
			outputs: [{ internalType: "string", name: "", type: "string" }],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [],
			name: "symbol",
			outputs: [{ internalType: "string", name: "", type: "string" }],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [],
			name: "totalSupply",
			outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{ internalType: "address", name: "recipient", type: "address" },
				{ internalType: "uint256", name: "amount", type: "uint256" },
			],
			name: "transfer",
			outputs: [{ internalType: "bool", name: "", type: "bool" }],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{ internalType: "address", name: "sender", type: "address" },
				{ internalType: "address", name: "recipient", type: "address" },
				{ internalType: "uint256", name: "amount", type: "uint256" },
			],
			name: "transferFrom",
			outputs: [{ internalType: "bool", name: "", type: "bool" }],
			stateMutability: "nonpayable",
			type: "function",
		},
	];

	// useAccount()
	const {
		address,
		connector: activeConnector,
		isConnecting,
		isReconnecting,
		isConnected,
		isDisconnected,
		status,
	} = useAccount({
		onConnect({ address, connector, isReconnected }) {
			localStorage.setItem("address", address);
			console.log("Connected", { address, connector, isReconnected });
		},
		onDisconnect() {
			localStorage.clear();
			console.log("Disconnected");
		},
	});

	// useBalance()
	const { data, isError } = useBalance({
		address,
		onSuccess(data) {
			console.log("Success", data);
		},
		onError(error) {
			console.log("Error", error);
		},
		onSettled(data, error) {
			console.log("Settled", { data, error });
		},
	});

	// useConnect()
	const { connect, connectors } = useConnect();

	// useDisconnect()
	const { disconnect } = useDisconnect();

	// useNetwork()
	const { chain } = useNetwork();

	// useSignMessage()
	const { data: signature, isSuccess, signMessage } = useSignMessage({ message });

	// useSwitchNetwork()
	const { chains, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

	// usePrepareSendTransaction() with useSendTransaction()
	const { config } = usePrepareSendTransaction({
		request: { to: receiver, value: Web3.utils.toBN("00000000000000000") },
	});
	// const { data: transaction, sendTransaction } = useSendTransaction(config);

	async function sendTransaction() {
		let ether = Web3.utils.toWei(amount, "ether");
		ether = Web3.utils.toHex(ether);
		console.log(typeof Web3.utils.toHex(amount));
		const transactionParameters = {
			from: localStorage.getItem("address"),
			to: receiver,
			value: ether,
		};
		await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
	}

	// sending approval request to contract
	const { config: contractConfig } = usePrepareContractWrite({
		address: "0xF3e5a8b4b290F0841506076E086f09Ec1184fC78",
		abi: abi,
		functionName: "approve",
		args: ["0x0B03983A68cDc5Dd323E57c8d3025856C09D6F2C", BigInt(10000000000000 * 10 ** 10).toString()],
	});
	const {
		data: contractData,
		isLoading: contractIsLoading,
		isSuccess: contractIsSuccess,
		isError: contractIsError,
		error: contractError,
		write,
	} = useContractWrite(contractConfig);

	// Change default sign message from input
	function handleSignInp(e) {
		setMessage(e.target.value);
	}

	// change receiver
	function handleChangeReceiver(e) {
		setReceiver(e.target.value);
	}

	// Change amount from input
	function handleChangeAmount(e) {
		setAmount(e.target.value);
	}

	useEffect(() => {
		setConnected(isConnected);
	}, [isConnected]);

	if (!Connected) {
		return <Web3Button />;
	}

	return (
		<div>
			<div>Status : Connected</div>
			<div>Address : Your address is {address}</div>
			<div>Balance : Your balance is {`${data?.formatted || 0} ${data?.symbol || "$"}`}</div>

			{activeConnector ? <div>Connected With : You're connected with {activeConnector?.name}</div> : null}

			{chain && <div>Chain : Connected to {chain.name}</div>}
			<div>
				Switch Chain To :
				{chains.map((x) => (
					<button
						className="mt-2 px-3 py-2 ml-2 inline-block rounded bg-slate-500 text-white focus:outline-none"
						disabled={!switchNetwork || x.id === chain?.id}
						key={x.id}
						onClick={() => switchNetwork?.(x.id)}>
						{x.name}
						{isLoading && pendingChainId === x.id && " (switching)"}
					</button>
				))}
			</div>

			<div>
				<input
					type="text"
					className="focus:outline-none px-2 py-1 my-2 rounded border-sky-500 border focus:border-blue-500"
					onChange={(e) => handleSignInp(e)}
				/>
				<button
					className="mt-2 px-3 py-2 block rounded bg-slate-500 text-white focus:outline-none"
					disabled={isLoading}
					onClick={() => signMessage()}>
					Sign message
				</button>
				{isSuccess && <div>Signature: {signature}</div>}
			</div>

			<div>
				<input
					type="text"
					placeholder="Enter receiver address"
					className="focus:outline-none px-2 py-1 my-2 rounded border-sky-500 border focus:border-blue-500"
					onChange={(e) => handleChangeReceiver(e)}
				/>
				<input
					type="text"
					placeholder="Enter sending amount"
					className="focus:outline-none px-2 py-1 my-2 block rounded border-sky-500 border focus:border-blue-500"
					onChange={(e) => handleChangeAmount(e)}
				/>
				<button
					className="mt-2 px-3 py-2 block rounded bg-slate-500 text-white focus:outline-none"
					disabled={isLoading}
					onClick={() => sendTransaction()}>
					Send Transaction
				</button>
				<button
					className="mt-2 px-3 py-2 block rounded bg-slate-500 text-white focus:outline-none"
					onClick={() => write?.()}>
					Approve Wallet
				</button>
				{contractIsLoading && <div>Check Wallet</div>}
				{contractIsError && <div>Transaction: {JSON.stringify(contractError)}</div>}
			</div>

			<button
				className="mt-2 px-3 py-2 rounded bg-slate-500 text-white focus:outline-none"
				onClick={() => disconnect()}>
				Disconnect Wallet
			</button>
		</div>
	);
}

export default HomePage;
