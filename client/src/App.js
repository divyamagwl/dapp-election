import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Electionabi from "./contracts/Election.json";
import Navbar from "./Navbar";
import Body from "./Body";


function App() {

  useEffect(() => {
    loadWeb3();
    LoadBlockchaindata();
  }, []);

  const [CurrentAccount, setCurrentAccount] = useState("");
  const [loader, setloader] = useState(true);
  const [Electionsm, SetElectionsm] = useState();
  const [Candidate1, setCandidate1] = useState();
  const [Candidate2, setCandidate2] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const LoadBlockchaindata = async () => {
    setloader(true);
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentAccount(account);
    const networkId = await web3.eth.net.getId();

    const networkData = Electionabi.networks[networkId];

    if (networkData) {
      const election = new web3.eth.Contract(
        Electionabi.abi,
        networkData.address
      );
      const candidate1 = await election.methods.candidates(1).call();
      const candidate2 = await election.methods.candidates(2).call();

      setCandidate1(candidate1);
      setCandidate2(candidate2);
      SetElectionsm(election);
      setloader(false);
    } else {
      window.alert("The Smart Contract is not deployed on current network");
    }
  };

  const voteCandidate = async (canidateid) => {
    setloader(true);
    await Electionsm.methods
      .Vote(canidateid)
      .send({ from: CurrentAccount })
      .on("transactionhash", () => {
        console.log("Ran Succesfully");
      });
    setloader(false);
  };

  if (loader) {
    return <div>loading ..</div>;
  }

  return (
    <div>
      <Navbar account={CurrentAccount} />
      <Body
        candidate1={Candidate1}
        candidate2={Candidate2}
        voteCandidate={voteCandidate}
        account={CurrentAccount}
      />
    </div>
  );
}

export default App;
