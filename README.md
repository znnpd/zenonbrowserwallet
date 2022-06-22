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

:rocket: There is also a [sample web3 website](https://github.com/znnpd/zenon-web3site.git) available to test interaction between website and extension, **give it a try!** :rocket:

## Remarks
* The extension not yet published in chrome webstore, only available as code to test locally
* By default the [public deeZNNnodez node](public.deeZNNodez.com) is used, can be changed in `src/config/default.ts`
* Sending and receiving transactions works only for fused accounts
* Create `.env` file based on `.env_example` file with mandatory environment variables for unit tests (which are barely existing as of today... ;). Not needed for using the extension!

## Warpdrive
This project was created as Warpdrive submission. Most of the features are implemented in PoC or MVP state. See [here](./docs/warpdrive.md) for original warpdrive submission.

# Installation

## Prerequisits
* Latest version of google chrome browser (at least >= version 102)
* NodeJS 

## Create build
* `npm run local_extension` creates `extension_build` directory and runs a webpack server (needed for developmentn only).

**Other scripts:**
* `npm run build` creates a react webapp for local UI testing (normal UI, cannot be used as an extension)
* `npm run local` starts the local webpack dev server for UI testing in browser (not as extension)

## Install extension locally in chrome
* `Options` >> `More Tools` >> `Extensions`
* Enable developer mode
* `Load unpacked`
* Choose `extension_build` folder in `zenonbrowserwallet` project

## Use the extension
Either open it manually from the chrome tab bar or via [sample web3 website](https://github.com/znnpd/zenon-web3site.git)