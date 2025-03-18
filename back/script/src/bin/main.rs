
use axum::{
    routing::{get, post},
    Router,
    Json,
};
use std::net::SocketAddr;
use tower_http::cors::{CorsLayer, Any};
use alloy_sol_types::SolType;
use clap::Parser;

use sp1_sdk::{include_elf, utils, ProverClient, SP1ProofWithPublicValues, SP1Stdin, HashableKey};
use serde::{Deserialize, Serialize};
/// The ELF (executable and linkable format) file for the Succinct RISC-V zkVM.
pub const MESSAGE_ELF: &[u8] = include_elf!("Message_to_Succinct");

/// The arguments for the command.
#[derive(Serialize, Deserialize)]
struct Score {
    text: String,
}
#[derive(Serialize, Deserialize)]
struct ProofData {
    proof: String,          
}

async fn receive_score(Json(mut text): Json<Score>) -> Json<ProofData> {
    // Setup the logger.
    sp1_sdk::utils::setup_logger();
    dotenv::dotenv().ok();

    // Setup the prover client.
    println!("Starting proving");
    let proof_path = format!("../provos/proof.bin");
    let mut stdin = SP1Stdin::new();
    stdin.write(&text);
	
    let client = ProverClient::from_env();
  
    let (pk, vk) = client.setup(MESSAGE_ELF);
    let mut proof = client.prove(&pk, &stdin).run().expect("Groth16 proof generation failed");
    println!("Got proved");
	
    proof.save(&proof_path).expect("Failed to save proof");
    println!("Proof saved");
	
    let proof = SP1ProofWithPublicValues::load(&proof_path).expect("Failed to load proof");
    println!("Proof Loaded:");

	
    client.verify(&proof, &vk).expect("Verification failed");
    println!("Proof verified successfully");

    Json(ProofData {
        proof: "Proof verified successfully".to_string(),
    })  
    

}
#[tokio::main]
async fn main() {
	let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);
    let app = Router::new()        
        .route("/score", post(receive_score)) 
		.layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("Server is running on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}