# ZenonBrowserWallet
Leightweight browser extension wallet for Zenon NoM similar to metamask. Real project name to be determined later by community.

# Warpdrive submission information

## Ambitions

ZenonBrowserWallet aims to be the standard tool to connect users of Web3 applications with the Zenon Network of Momentum. Development will happen under **MIT license** which is in category permissive open source.

**NOTE** During development phase we keep work in a private repo. All code will be made public available at the latest afer go-live.

Until mid 2022 we focus on the following features implemented as **chrome extension MVP**:
* Import existing accounts or create new accounts
* Sign transactions from web3 websites
* Define interaction protocol between websites and ZenonBrowserWallet
* Send/receive transactions
* Show balance of all coins
* Fuse plasma
* Transaction overview

Post-MVP evolution will be defined based on community feedback and may include things like:
* multiple browser support
* integration with other warpdrive projects like IAMZ to enable seamless authentication
* etc.

## Impact
Web3 applications based on smart contracts will be the foundation of a vibrant Zenon ecosystem with plenty of innovative projects. ZenonBrowserWallet will be a fundamential piece which boosts development of Web3 applications and therefore plays an important role for the growth of Zenon Network.  The target audience will benefit in the following way:
* For Web3 application developers ZenonBrowserWallet will be an easy-to-integrate tool to provide their users a secure way to interact with Zenon Network. It enables faster development by providing a standard tool with defined interaction protocol.
* For Web3 application users ZenonBrowserWallet will provide one single tool with a common user experience accross multiple Web3 applications.
* For Zenon users the ZenonBrowserWallet will be a lightweight wallet providing the main basic functionality to interact with Zenon Network.

## Status
We are currently working on two main topics:
* Prototype UI development (with mocked network interaction)
* Technical analysis and some playground implementations of various aspects, with the following outcome (as by now):
  * Dart SDK must be adjusted because quite a few components cannot be used in web context (e.g. wallets as files, websocket library, dart:ffi and dart:io not supported, etc.)
  * We will use React to develop the extension and dart2js to generate javascript code
  * C-Code for PoW and Argon2 to be released by Zenon developers is a prerequisit to compile for WASM

## Stepstones
The following milestones define the project progress for MVP:

### Milestone 1
* Chrome extension prototype with all UI elements for functionalities defined above
* Dart SDK adjustments to create javascript code which works in web context (without C-Code for PoW and Argon2)

### Milestone 2
* C-Code compilation and integration in javascript code (assuming c-code is open-sourced)
* Integration of javascript code into UI prototype

### Milestone 3
* Interaction protocol specification (between web3 application and wallet)
* Comprehensive testing

### Milestone 4
* Penetration testing by community and/or professional pentest companies

## Uniqueness
We are not aware of any similar initiatives as of today.

## Expenses
For development we don't expect significat expenses except our precious time 😃. However for professional penetration testing there will be expenses. We suggest that the need for this will be determined by judges and community in the future based on the maturity of our project.

## Accelerator-Z
We don't see any reasons yet to apply for Accelerator-Z funding. However, nobody can predict the future and it all depends on the success and evolution of our project 😃
