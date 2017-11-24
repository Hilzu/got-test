# got-test

[![Build Status](https://secure.travis-ci.org/hiddentao/got-test.svg?branch=master)](http://travis-ci.org/hiddentao/got-test)
[![NPM module](https://badge.fury.io/js/got-test.svg)](https://badge.fury.io/js/got-test)

Features:
* Lightweight, works in Node.js and browsers
* Supports custom-generated mnemonics
* Batch-generate addresses in iterations
* Sign transactions
* Comprehensive test coverage

## Installation

```shell
npm install got-test
```
Or if using Yarn:

```shell
yarn add got-test
```

## API

**(static) fromMnemonic(): Generate wallet from mnemonic**

```js
const { generateMnemonic, EthHdWallet } = require('got-test')

const wallet = EthHdWallet.fromMnemonic(generateMnemonic())

console.log( wallet instanceof EthHdWallet ); /* true */
*/
```


**generateAddresses(): Generating addresses**

```js
// generate 2 addresses
console.log( wallet.generateAddresses(2) )

/*
[
  '0xd7c0cd9e7d2701c710d64fc492c7086679bdf7b4',
  '0x1acfb961c5a8268eac8e09d6241a26cbeff42241',
]
*/
```

**discardAddresses(): Discarding addresses**

```js
// generate 5 addresses
wallet.generateAddresses(5)
// discard the last 2 (leaving just the first 3)
console.log( wallet.discardAddresses(2) )

/*
[
  '0xd7c0cd9e7d2701c710d64fc492c7086679bdf7b4',
  '0x1acfb961c5a8268eac8e09d6241a26cbeff42241',
]
*/
```

_Note: the next time you run `generateAddresses()` it will again generate
those discarded addresses_.

**getAddresses(): Get all generated addresses**

```js
wallet.generateAddresses(2)
wallet.generateAddresses(3)

// get all addresses
console.log( wallet.getAddresses() )

/*
[
  '0xd7c0cd9e7d2701c710d64fc492c7086679bdf7b4',
  '0x1acfb961c5a8268eac8e09d6241a26cbeff42241',
  '0xabc2bca51709b8615147352c62420f547a63a00c',
  '0x26042cb13cc4140a281c0fcc7464074c5e9fd0b4',
  '0x5d0d1a012a3ab2b3424c2023246d8c834bf599d9'
]
*/
```

**hasAddress(): Check if given address exists in current list of generated addresses**

```js
wallet.generateAddresses(2)
wallet.generateAddresses(3)

/*
[
  '0xd7c0cd9e7d2701c710d64fc492c7086679bdf7b4',
  '0x1acfb961c5a8268eac8e09d6241a26cbeff42241',
  '0xabc2bca51709b8615147352c62420f547a63a00c',
  '0x26042cb13cc4140a281c0fcc7464074c5e9fd0b4',
  '0x5d0d1a012a3ab2b3424c2023246d8c834bf599d9'
]
*/

wallet.hasAddress('0x1efd1a012a3ab2b3424c2023246d8c834bf58723') /* false */
wallet.hasAddress('0x26042cb13cc4140a281c0fcc7464074c5e9fd0b4') /* true */
```

**getAddressCount(): Get no. of addresses**

```js
wallet.generateAddresses(2)
wallet.generateAddresses(3)

console.log( wallet.getAddressCount() ) /* 5 */
```

**sign(): Sign a transaction**

```js
const rawTx = wallet.sign({
  from: '0x...',
  to: '0x...',
  value: 200000000000000000,
  nonce: 0x0,
  gasPrice: 50000000000,
  gasLimit: 21000,
  chainId: 1 /* see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md */
})

console.log( rawTx ) /* "0x...." */

web3.eth.sendRawTransaction(rawTx, (err) => { ... })
```


## Developing

Ensure you have [geth](https://github.com/ethereum/go-ethereum) installed and
available in your `PATH`.

* To run tests: `yarn test`
* Tests with coverage: `yarn test:coverage`
* Tests with watcher: `yarn test:watch`
* Linter: `yarn lint`
* Build `dist/`: `yarn build`

_Note: If you've never installed `geth` before then make
sure you run `geth makedag 0 ~/.ethash` to generate the DAG needed for mining,
otherwise the tests will timeout._

## Acknowledgements

Inspired by code from the following great projects:

* https://github.com/ConsenSys/eth-lightwallet
* https://github.com/MetaMask/eth-hd-keyring
* https://github.com/trapp/ethereum-bip44

## References

* https://github.com/ethereum/EIPs/issues/85
* https://github.com/MetaMask/metamask-extension/issues/640

## License

MIT - see [LICENSE.md](LICENSE.md)