const fs = require("fs");
const solc = require("solc");
const { Web3 } = require("web3");

// Connect to local Ethereum node
const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");

// Compile the source code
const sourceCode = fs.readFileSync("./hello.sol", "utf8");

// Compile the Solidity code
const input = {
  language: "Solidity",
  sources: {
    "hello.sol": {
      content: sourceCode,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

// Check for compilation errors
if (compiledCode.errors) {
  compiledCode.errors.forEach((error) => {
    console.error(error.formattedMessage);
  });
  process.exit(1); // Exit with non-zero status code to indicate failure
}
const outputFile = "./compiledCode.json";
fs.writeFileSync(outputFile, JSON.stringify(compiledCode, null, 2), "utf8");

const result = compiledCode.contracts["hello.sol"]["Counter"];

web3.eth
  .getAccounts()
  .then((accounts) => {
    console.log("====================================");
    console.log(accounts);
    console.log("====================================");
    return new web3.eth.Contract(result.abi)
      .deploy({ data: result.evm.bytecode.object })
      .send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: "30000000000000",
      });
  })
  .then((contract) => {
    console.log("Contract deployed at ", contract.options.address);
  })
  .catch((error) => {
    console.error(error);
  });
