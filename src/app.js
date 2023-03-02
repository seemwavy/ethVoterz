import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import EthVoterContract from 'src/ethVote.json';
import "src/styles.css"

const ETHEREUM_NETWORK = "goerli";
const ETHEREUM_NETWORK_ID = "5";
const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

function App() {
  const [isVoter, setIsVoter] = useState(false);
  const [vote, setVote] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          const networkId = await web3Instance.eth.net.getId();
          if (networkId === ETHEREUM_NETWORK_ID) {
            setWeb3(web3Instance);
          } else {
            alert("Please switch to the Goerli test network");
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("Please install MetaMask to use this dApp");
      }
    }

    initWeb3();
  }, []);

  useEffect(() => {
    async function fetchAccount() {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setIsVoter(false);
        }
      }
    }

    fetchAccount();
  }, [web3]);

  useEffect(() => {
    async function fetchVoteData() {
      if (web3) {
        const ethVoterContract = new web3.eth.Contract(
          EthVoterContract.abi,
          CONTRACT_ADDRESS
        );
        const currentVoteId = await ethVoterContract.methods.getCurrentVoteId().call();

        if (currentVoteId !== 0) {
          const currentVote = await ethVoterContract.methods.getVote(currentVoteId).call();
          setVote(currentVote);
        }
      }
    }

    fetchVoteData();
  }, [web3]);

  return (
    <body>
    <div id="connectWallet">
      {web3 ? (
        <p>Connected with {web3.currentProvider.constructor.name}</p>
      ) : (
        <button id="connectButton" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
    <div id="header">
      <h1>EthVoterz</h1>
      <p>
        Testnet Eth Holders, the time has come to find consensus on life's
        greatest questions: Apples or Oranges? Mario or Luigi? Tits or Ass?
        One Piece or Naruto? Find consensus throught the wisdom of the
        blockchain.
      </p>
      <p>
        Pay .01 Goerli ETH to become a voter! Pay .02 Goerli eth to propose
        your own vote. Welcome to ETHVoterz!{' '}
      </p>
    </div>
    <h2>Current Vote</h2>
    <div id="votingStage">
      <h3 id="currentVoteTitle">{vote.voteQuestion}</h3>
      <div id="pollContainer">
        <div id="optionA">
          <h4 id="titleOptionA">{vote.voteOptionA}</h4>
          <div className="hl"></div>
          <h3 id="optionAVotes">{vote.voteCountA}</h3>
          {isVoter && (
            <button
              id="voteButton"
              onClick={() => voteForOption('A')}
            >
              Vote for {vote.voteOptionA}
            </button>
          )}
        </div>
        <div className="vl"></div>
        <div id="optionB">
          <h4 id="titleOptionB">{vote.voteOptionB}</h4>
          <div className="hl"></div>
          <h3 id="optionBVotes">{vote.voteCountB}</h3>
          {isVoter && (
            <button
              id="voteButton"
              onClick={() => voteForOption('B')}
            >
              Vote for {vote.voteOptionB}
            </button>
          )}
        </div>
      </div>
    </div>
    <div id="durationBox">{vote.duration}</div>
    <div id="nextInQueue">{vote.voteQuestion}</div>
  </body>
  );
}  