import "dotenv/config";
import {
    getExplorerLink,
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("devnet"));

const sender = getKeypairFromEnvironment("SECRET_KEY_2");

console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${sender.publicKey.toBase58()}`
);

// Add the recipient public key here.
const recipient = new PublicKey("ACAUyxZRvHmqbqnB6JceQU3Kf5pTP85Uarp3BgL7tkjW");

// Subtitute in your token mint account
const tokenMintAccount = new PublicKey("D195CMpvJRtdP9VNnDLcfftzBAByX2DckDuxNRYAR5ga");

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

console.log(`💸 Attempting to send 1 token to ${recipient.toBase58()}...`);

const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    sender.publicKey
);

const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    recipient
);

const signature = await transfer(
    connection,
    sender,
    sourceTokenAccount.address,
    destinationTokenAccount.address,
    sender,
    1 * MINOR_UNITS_PER_MAJOR_UNITS
);

const explorerLink = getExplorerLink("transaction", signature, "devnet");

console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}!`);