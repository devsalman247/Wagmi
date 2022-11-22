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
} from "wagmi";

function HomePage() {
  const [Connected, setConnected] = useState(false);
  const [message, setMessage] = useState("Connecting to demo dapp");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState(0);

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
  const {
    data: signature,
    isSuccess,
    signMessage,
  } = useSignMessage({ message });

  // useSwitchNetwork()
  const { chains, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

  // usePrepareSendTransaction() with useSendTransaction()
  const { config } = usePrepareSendTransaction({
    request: { to: receiver, value: Web3.utils.toBN("00000000000000000") },
  });
  const { data: transaction, sendTransaction } = useSendTransaction(config);

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
      <div>
        Balance : Your balance is {`${data?.formatted || 0} ${data?.symbol || '$'}`}
      </div>

      {activeConnector ? (
        <div>
          Connected With : You're connected with {activeConnector?.name}
        </div>
      ) : null}

      {chain && <div>Chain : Connected to {chain.name}</div>}
      <div>
        Switch Chain To :
        {chains.map((x) => (
          <button
            className="mt-2 px-3 py-2 ml-2 inline-block rounded bg-slate-500 text-white focus:outline-none"
            disabled={!switchNetwork || x.id === chain?.id}
            key={x.id}
            onClick={() => switchNetwork?.(x.id)}
          >
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
          onClick={() => signMessage()}
        >
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
          onClick={() => sendTransaction()}
        >
          Send Transaction
        </button>
      </div>

      <button
        className="mt-2 px-3 py-2 rounded bg-slate-500 text-white focus:outline-none"
        onClick={() => disconnect()}
      >
        Disconnect Wallet
      </button>
    </div>
  );
}

export default HomePage;
