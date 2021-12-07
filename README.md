# ZenonBrowserWallet
Leightweight browser extension wallet for Zenon NoM similar to metamask. Real project name to be determined later by community.

# Warpdrive submission information

## Ambitions
_What is the goal that you want to achieve with your project in the next 6 months. What are the features you want to implement, studies you want to carry out, areas you want to expand to in that timeframe._</br>

ZenonBrowserWallet aims to be the standard tool to connect users of Web3 applications with the Zenon Network of Momentum. Development will happen under **permissive open source licensing**, to be determined which license exactly will be chosen.

Until mid 2022 we focus on the following features implemented as **MVP chrome extension**:
* Import existing accounts or create new accounts
* Sign transactions from web3 websites
* Define interaction protocol between websites and ZenonBrowserWallet
* Send/receive transactions
* Show balance of all coins

Post-MVP evolution will be defined based on community feedback and may include integration with other warpdrive projects like IAMZ to enable seamless authentication, etc.

## Impact
_Why and how would your project idea help Zenon Network to grow,  increase its reach or make it more accesible. What’s the benefit for the community. What features would your project provide that are not present yet._</br>
 
Web3 applications based on smart contracts will be the foundation of a vibrant Zenon ecosystem with plenty of innovative projects. ZenonBrowserWallet will be a fundamential piece which boosts development of Web3 applications and therefore plays an important role for the growth of Zenon Network.  The target audience will benefit in the following way:
* For Web3 application developers ZenonBrowserWallet will be an easy-to-integrate tool to provide a secure way to interact with Zenon Network to their users. It enables faster development by providing a standard tool with defined interaction protocol.
* For Web3 application users ZenonBrowserWallet will provide one single tool with a common user experience accross multiple Web3 applications.

## Status
_Give a description of the current progress of your project. Also add links to code repositories, articles, websites or other resources that you have been working on, that are relevant to this project._
 
We are currently working on two main topics:
* Prototype UI development (with mocked network interaction)
* Technical analysis and some playground implementations of various aspects, with the following outcome (by now):
  * Dart SDK must be adjusted because quite a few components cannot be used in web context (e.g. wallets as files, websocket library, dart:ffi and dart:io not supported, etc.)
  * We will use React to develop the extension and dart2js to generate javascript code
  * C-Code for PoW and Argon2 to be released by Zenon developers is a prerequisit to compile for WASM

## Stepstones
_Given your ambitions for the next 6 months, please define two to four interim results or milestones that you aim to achieve, and that would help us evaluating the progress you are making._</br>

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
_If there are other, similar initiatives, either by Zenon or the community, please list those and tell us what sets or will set your ideas apart._</br>
We are not aware of any similar initiatives as of today.

## Expenses
_Given your ambitions for the next 6 months, will you have necessary expenses, e.g. for infrastructure cost or payment of participators?_</br>
For development we don't expect significat expenses except our precious time 😃. However for professional penetration testing there will be expenses. We suggest that the need for this will be determined by judges and community in the future based on the maturity of our project.

## Accelerator-Z
_Do you currently think that you’ll likely want to apply to Accelerator-Z, provided received funding helps you achieve near-term goals?_</br>
_Accelerator-Z infos: https://medium.com/@zenon.network/zenon-fabric-paving-the-way-for-mass-scale-adoption-12f0ecd5411a_</br>
We don't see any reasons yet to apply for Accelerator-Z funding. However, nobody can predict the future and it all depends on the success and evolution of our project 😃
