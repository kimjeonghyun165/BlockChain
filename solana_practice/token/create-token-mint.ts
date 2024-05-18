import { createMint } from "@solana/spl-token";
import "dotenv/config";
import {
    getKeypairFromEnvironment,
    getExplorerLink,
} from "@solana-developers/helpers";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const user = getKeypairFromEnvironment("SECRET_KEY_2");

console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);

// This is a shortcut that runs:
// SystemProgram.createAccount
// token.createInitializeMintInstruction
// See https://www.soldev.app/course/token-program
const tokenMint = await createMint(connection, user, user.publicKey, null, 2);

const link = getExplorerLink("address", tokenMint.toString(), "devnet");

console.log(`✅ Finished! Created token mint: ${link}`);



//token address : D195CMpvJRtdP9VNnDLcfftzBAByX2DckDuxNRYAR5ga
//owner address : ACAUyxZRvHmqbqnB6JceQU3Kf5pTP85Uarp3BgL7tkjW
//owner ATA : FyeEqU1qGqR5H51kHXWu6aj7zTqCrRHDQUtjjSxtvs4z