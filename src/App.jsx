import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

import { Web3Modal } from "@web3modal/react";

import { chain, configureChains, createClient, WagmiConfig } from "wagmi";

import HomePage from "./Home";

function App() {
  
  const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.goerli, chain.arbitrum];

  const { provider } = configureChains(chains, [
    walletConnectProvider({ projectId: "f3cd5988a9d89b94b82b627a339f6e3d" }),
  ]);

  const wagmiClient = createClient({
    connectors: modalConnectors({ appName: "web3Modal", chains }),
    provider,
  });

  const ethereumClient = new EthereumClient(wagmiClient, chains);

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <HomePage />
      </WagmiConfig>

      <Web3Modal
        projectId="f3cd5988a9d89b94b82b627a339f6e3d"
        theme="dark"
        accentColor="default"
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default App;
