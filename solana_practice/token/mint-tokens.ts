import { mintTo, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import "dotenv/config";
import {
    getExplorerLink,
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const user = getKeypairFromEnvironment("SECRET_KEY_1");

const tokenMintAccount = new PublicKey(
    "D195CMpvJRtdP9VNnDLcfftzBAByX2DckDuxNRYAR5ga"
);

const recipientPublicKey = new PublicKey(
    "gQrtAQE3PkdZDCapmNKAg4xgKdbrD4tAhsYqm4jr22S"
);

const recipientAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user, // 수수료 지불자
    tokenMintAccount, // 토큰 민트
    recipientPublicKey // 토큰을 받을 지갑 주소
);

const transactionSignature = await mintTo(
    connection,
    user,
    tokenMintAccount,
    recipientAssociatedTokenAccount.address,
    user,
    10 * MINOR_UNITS_PER_MAJOR_UNITS
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);
