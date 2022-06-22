# ZenonBrowserWallet
Lightweight browser extension wallet for Zenon NoM similar to metamask with the following capabilities:
* Import existing accounts or create new accounts
* Send signed transactions from web3 websites
* Interaction protocol between websites and ZenonBrowserWallet (currently based on messaging, will be abstracted in a dedicated library later)
* Send/receive transactions
* Show balance of all coins
* Transaction overview
* Manage trusted web3 websites

See [here](./docs/components.md) for some more information about the extension components and message flows.

There is also a [sample web3 website](https://github.com/znnpd/zenon-web3site.git) available to test interaction between website and extension, **give it a try!**

## Special remarks:
* The extension not published in chrome webstore, only available as code to test locally
* By default the [public deeZNNnodez node](public.deeZNNodez.com) is used, can be changed in `src/config/default.ts`
* Sending and receiving transactions works only for fused accounts
* Check `.env_example` file for mandatory environment variables for unit tests (which are barely existing as of today... ;)

## Warpdrive
See [here](./docs/warpdrive.md) for original warpdrive submission.

# Installation

## Prerequisits
* Latest version of google chrome browser (at least >= version 102)
* NodeJS 

## Setup
* `npm run build` creates a react webapp for local UI testing (normal UI, cannot be used as an extension)
* `npm run local` starts the local webpack dev server for UI testing in browser (not as extension)
* `npm run local_extension` creates `extension_build` directory and runs a webpack server (which is not really needed). The directory can be loaded by chrome extension to test it locally


