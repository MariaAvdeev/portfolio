import { Web3 } from "web3";

let web3 = new Web3();
let hashesProcessed = 0;
let shouldMine = false;

function calculateHash(telegramUserId, blockNumber, prevBlockHash, nonce) {
  const telegramUserIdHex = web3.utils.padLeft(
    web3.utils.toHex(telegramUserId),
    16
  );
  const blockNumberHex = web3.utils.padLeft(web3.utils.toHex(blockNumber), 16);
  const prevBlockHashHex = web3.utils.padLeft(prevBlockHash, 64);
  const nonceHex = web3.utils.padLeft(web3.utils.toHex(nonce), 16);

  const concatenatedHex =
    "0x" +
    [telegramUserIdHex, blockNumberHex, prevBlockHashHex, nonceHex]
      .map((hex) => hex.replace("0x", ""))
      .join("");

  return web3.utils.keccak256(concatenatedHex);
}

function startMining(startNonce, range, iterations, data) {
  const { difficulty, telegramUserId, blockNumber, prevBlockHash } = data;
  let bestHash = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  const startTime = Date.now();
  shouldMine = true;

  const mine = async () => {
    for (let i = 0; i < iterations && shouldMine; i++) {
      for (
        let nonce = startNonce;
        nonce < startNonce + range && shouldMine;
        nonce++
      ) {
        const hash = calculateHash(
          telegramUserId,
          blockNumber,
          prevBlockHash,
          nonce
        );
        hashesProcessed++;

        const hashValue = BigInt(hash);
        const difficultyValue = BigInt(difficulty);
        const maxValue = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        const target = maxValue / difficultyValue;

        if (hashValue < BigInt(bestHash)) {
          bestHash = hashValue;
          const hashRate = (
            hashesProcessed /
            ((Date.now() - startTime) / 1000)
          ).toFixed(2);
          self.postMessage({
            type: "BEST_HASH",
            bestHash: "0x" + hashValue.toString(16).padStart(64, '0'),
            hashRate: `${hashRate} H/s`,
            hashesProcessed,
          });
        }

        // Compare hash against target
        if (hashValue < target) {
          const hashRate = (
            hashesProcessed /
            ((Date.now() - startTime) / 1000)
          ).toFixed(2);
          self.postMessage({
            type: "SUBMIT_BLOCK",
            nonce: nonce,
            hash: "0x" + hashValue.toString(16).padStart(64, '0'),
            hashRate: `${hashRate} H/s`,
            hashesProcessed,
            difficulty,
          });
          return;
        }

        if (hashesProcessed % 1000 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    }
  };

  mine();
}

self.onmessage = (event) => {
  const message = event.data;
  switch (message.type) {
    case "START_MINING":
      startMining(
        message.startNonce,
        message.range,
        message.iterations,
        message.data
      );
      break;
    case "STOP_MINING":
      shouldMine = false;
      break;
  }
};
