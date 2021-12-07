# ZenonBrowserWallet
Leightweight browser extension wallet for Zenon NoM similar to metamask. Real project name to be determined later by community.

# Warpdrive submission information

## Ambitions
_What is the goal that you want to achieve with your project in the next 6 months. What are the features you want to implement, studies you want to carry out, areas you want to expand to in that timeframe._
Zenon Browser Wallet aims to be the standard connector for users of Web3 applications with the Zenon Network of Momentum. 

Until mid 2022 we focus on the following features implemented as **MVP chrome extension**:
* Import existing accounts or create new accounts
* Sign transactions from web3 websites
* Define interaction protocol between websites and ZenonBrowserWallet
* Send/receive transactions
* Show balance of all coins

Development will happen under permissive open source licensing, to be determined which license exactly will be chosen.

## Impact
_Why and how would your project idea help Zenon Network to grow,  increase its reach or make it more accesible. What’s the benefit for the community. What features would your project provide that are not present yet._  
 
Web3 applications based on smart contracts will be the foundation of a vibrant Zenon ecosystem with plenty of innovative projects. ZenonBrowserWallet will play an important role to support the growth of Zenon Network in the following areas:
* For Web3 application developers ZenonBrowserWallet will be an easy-to-integrate tool to provide their users a secure way to interact with Zenon Network
* For Web3 application users ZenonBrowserWallet will provide one single tool and a common user experience accross multiple applications

## Status
_Give a description of the current progress of your project. Also add links to code repositories, articles, websites or other resources that you have been working on, that are relevant to this project._
 
We are currently working on two main topics:
* Prototype UI development with mocked network ongoing
* Technical analysis and some playground implementations of various aspects, with the following outcome (by now):
  * Dart SDK must be adjusted because quite a few components cannot be used in web context (e.g. wallets as files, websocket library, dart:ffi not supported, etc.)
  * We will use React to develop the extension and dart2js to create Javascript script code
  * C-Code for PoW and Argon2 to be released by Zenon developers is a prerequisit to compile them for WASM

## Stepstones
Given your ambitions for the next 6 months, please define two to four interim results or milestones that you aim to achieve, and that would help us evaluating the progress you are making.

## Uniqueness
If there are other, similar initiatives, either by Zenon or the community, please list those and tell us what sets or will set your ideas apart.

## Expenses
Given your ambitions for the next 6 months, will you have necessary expenses, e.g. for infrastructure cost or payment of participators?

## Accelerator-Z
Do you currently think that you’ll likely want to apply to Accelerator-Z, provided received funding helps you achieve near-term goals?
