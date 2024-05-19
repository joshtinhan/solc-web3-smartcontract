import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Button, InputNumber, Flex } from "antd";
import useWeb3Abi from "./hooks/useWeb3Abi";
function App() {
  const { web3Ref, abiRef } = useWeb3Abi();
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState("");
  const [accounts, setAccounts] = useState("");
  const [contractCount, setContractCount] = useState(0);
  const [contractValue, setContractValue] = useState(0);

  const contractGetter = useCallback(async () => {
    const newVal = await abiRef.current.methods.get().call();
    setContractCount(Number(newVal));
  }, [abiRef]);

  const balanceGetter = useCallback(async () => {
    const balanceVal = await web3Ref.current.eth.getBalance(accounts);
    setBalance(Number(balanceVal) / 100);
  }, [accounts, web3Ref]);

  const contractSetter = useCallback(
    async (v) => {
      await abiRef.current.methods.set(v).send({ from: accounts });
      contractGetter();
      balanceGetter();
    },
    [accounts, contractGetter, balanceGetter, abiRef]
  );
  const contractCaller = useCallback(
    async (methodName) => {
      if (!abiRef) return;
      try {
        switch (methodName) {
          case "inc":
            await abiRef.current.methods.inc().send({ from: accounts });
            contractGetter();
            balanceGetter();
            break;
          case "dec":
            await abiRef.current.methods.dec().send({ from: accounts });
            contractGetter();
            balanceGetter();
            break;
          case "get":
            contractGetter();
            break;
          default:
            break;
        }
      } catch (error) {
        setStatus(error);
      }
    },
    [accounts, contractGetter, balanceGetter, abiRef]
  );

  useEffect(() => {
    if (web3Ref.current) {
      web3Ref.current.eth
        .requestAccounts()
        .then((accs) => {
          setAccounts(accs[0]);
        })
        .catch((error) => {
          console.error("Error getting accounts:", error);
        });
    }
  }, [web3Ref]);

  useEffect(() => {
    if (!abiRef.current) return;
    contractGetter();
  }, [contractGetter, abiRef]);

  useEffect(() => {
    try {
      accounts && balanceGetter();
    } catch (err) {
      setStatus(err);
    }
  }, [accounts, balanceGetter]);

  return (
    <div className="App">
      <header className="App-header">
        {status && <h1 className="App-title">{status}</h1>}
        <h1 className="App-title">{`Balance: ${balance} H@`}</h1>
        <h1 className="App-title">{`Account: ${accounts}`}</h1>
        <h1 className="App-title">{`Counter: ${contractCount}`}</h1>
        <Flex gap={10} align="center">
          <h2 className="App-title">Contract ABI</h2>
          <Button type="primary" onClick={() => contractCaller("inc")}>
            {" "}
            +{" "}
          </Button>
          <Button type="primary" onClick={() => contractCaller("dec")}>
            {" "}
            -{" "}
          </Button>
          <Flex gap={5} align="center">
            <InputNumber
              size="small"
              placeholder="請輸入數字"
              onChange={setContractValue}
            />
            <Button onClick={() => contractSetter(contractValue)}>送出</Button>
          </Flex>
        </Flex>
      </header>
    </div>
  );
}

export default App;
