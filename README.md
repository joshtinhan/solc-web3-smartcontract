# Getting Started with Create React App

This project is structured by two parts:

1. contract:
- Written by Solidity
- Run RPC server on local by `ganache`
- Compiled by `solc.js`
- Deployed by `web3.js` on your local Ethereum blockchain

```bash
# install dependencies and run RPC server locally
cd contract
npm install -g ganache
npm install
ganache
```

```bash
# compile and deploy contract
cd contract
node web3.js
```

2. web
- Bootstrapped with `Create React App`
- UI library: `Ant Design`
- Copy ABI json file from: `contract/compiledCode.json`

```bash
# install dependencies and run web app
cd web
npm install
npm run start
```