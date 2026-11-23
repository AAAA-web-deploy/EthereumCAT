// Launch configuration. Enter only VERIFIED information; never substitute a reference token's address.
// UI deliberately refuses to send traders to a generic, fabricated swap URL.
const CONFIG = Object.freeze({
  name: 'Ethereum Cat', symbol: 'ETHCAT', network: 'Ethereum Mainnet', chainId: 1,
  contractAddress: '', // set to this newly launched ETHCAT contract (0x + 40 hexadecimal chars)
  tokenSupply: '', // e.g. "1,000,000,000 ETHCAT", once independently verified
  transferTax: '', // e.g. "0%", once verified in the actual contract
  buyUrl: '', // optional verified swap route for the deployed token
  socials: {X:'',Telegram:'',GitHub:''},
  rpcUrls: ['https://ethereum-rpc.publicnode.com','https://cloudflare-eth.com'],
  blockPollMs: 15000, blockRequestTimeoutMs: 6500
});
