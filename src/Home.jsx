import { useState, useEffect } from "react";
import { Web3Button } from "@web3modal/react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useNetwork,
  useSignMessage,
  useSwitchNetwork,
} from "wagmi";

function HomePage() {
  const [Connected, setConnected] = useState(false);
  const [message, setMessage] = useState("Connecting to demo dapp");

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
    token: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
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
  const { data: signature, isSuccess,signMessage } = useSignMessage({message});

  // useSwitchNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

  function handleSignInp(e) {
    setMessage(e.target.value);
  }

  useEffect(() => {
    setConnected(isConnected);
    if (address) {
      console.log("Connected");
    }
  }, [isConnected]);

  if (!Connected) {
    return <Web3Button />;
  }

  return (
    <div>
      <div>Status : Connected</div>
      <div>Address : Your address is {address}</div>
      <div>
        Balance : Your balance is {`${data?.formatted || 0} ${data?.symbol}`}
      </div>

      {activeConnector ? (
        <div>
          Connected With : You're connected with {activeConnector?.name}
        </div>
      ) : null}

      {chain && <div>Chain : Connected to {chain.name}</div>}
      {chains.map((x) => (
        <button
          className="mt-2 px-3 py-2 block rounded bg-slate-500 text-white focus:outline-none"
          disabled={!switchNetwork || x.id === chain?.id}
          key={x.id}
          onClick={() => switchNetwork?.(x.id)}
        >
          {x.name}
          {isLoading && pendingChainId === x.id && " (switching)"}
        </button>
      ))}

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
