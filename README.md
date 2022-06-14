# Being Accountable Never Cheats: An Incentive for DeFi Oracles

## System/Packages Requirements

The neccessary prerequisites are:

- [Ethereum Truffle testnet](https://www.trufflesuite.com/docs/truffle/getting-started/installation) framework, v4.1.15 (core version: 4.1.15)
- [Solidity](https://docs.soliditylang.org/en/v0.7.4/) compiler, v0.4.25 (solc-js, stricyly for ECDSA verification)
- [Ganache](https://www.trufflesuite.com/ganache)
- Misc: python, make, etc,. (to update)

## Running test cases

To test *late report* oracle penalty, run `./run.sh 1_late_report`, which will execute `/run/run_1_late_report.js` test file on Truffle testnet.

To test *high deviation* oracle penalty, run `./run.sh 2_high_deviation`

To test *wrong source* oracle penalty, run `./run.sh 3_wrong_source`

To test *wrong methodology* oracle penalty, run `./run.sh 4_wrong_methodology`

To test *slow reaction* oracle penalty, run `./run.sh 5_slow_reaction`

To test dispute, run `./run.sh dispute`


## Contact
Bowen@ bowen_liu@mymail.sutd.edu.sg
