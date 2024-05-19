import { useEffect, useRef } from "react";
import CONTRACT_JSON from "../compiledCode.json";
import Web3 from "web3";

const CONTRACT_ADDRESS = "0xfe10485C2DbcD23D543c031306a648F754b73b0B";

export default function useWeb3Abi() {
  const web3Ref = useRef(null);
  const abiRef = useRef(null);

  useEffect(() => {
    web3Ref.current = new Web3(window.ethereum);
    abiRef.current = new web3Ref.current.eth.Contract(
      CONTRACT_JSON["contracts"]["hello.sol"]["Counter"].abi,
      CONTRACT_ADDRESS
    );
  }, []);

  return { web3Ref, abiRef };
}
