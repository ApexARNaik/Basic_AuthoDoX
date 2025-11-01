// --- 1. CONFIGURATION ---
const contractAddress = "0x92Cd43088f0d6Fa88BaB355b224d973bd486019D"; // PASTE ADDRESS
const contractABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_nftContractAddress",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "contentCid",
                type: "string",
            },
        ],
        name: "ContentAlreadyRegistered",
        type: "error",
    },
    {
        inputs: [],
        name: "OnlyOwner",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "NftContractOwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "author",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "promptCid",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "contentCid",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "metadataUri",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "optionalChatLink",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "ProofRegistered",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_promptCid",
                type: "string",
            },
            {
                internalType: "string",
                name: "_contentCid",
                type: "string",
            },
            {
                internalType: "string",
                name: "_metadataUri",
                type: "string",
            },
            {
                internalType: "string",
                name: "_optionalChatLink",
                type: "string",
            },
        ],
        name: "registerProof",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_newOwner",
                type: "address",
            },
        ],
        name: "transferNftContractOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        name: "contentCidRegistered",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nftContract",
        outputs: [
            {
                internalType: "contract AuthoDoxNFT",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "proofData",
        outputs: [
            {
                internalType: "string",
                name: "promptCid",
                type: "string",
            },
            {
                internalType: "string",
                name: "contentCid",
                type: "string",
            },
            {
                internalType: "string",
                name: "metadataUri",
                type: "string",
            },
            {
                internalType: "string",
                name: "optionalChatLink",
                type: "string",
            },
            {
                internalType: "address",
                name: "author",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
]; // PASTE ABI
const ADMIN_PASSWORD = "2306"; // Change if desired (insecure demo password)
const IPFS_GATEWAY = "https://dweb.link/ipfs/"; // Or your preferred gateway
// IMPORTANT: Store your Pinata JWT in Replit Secrets under the key 'VITE_PINATA_JWT'
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT; // Use Vite's method

// --- 2. GLOBAL VARIABLES ---
let provider;
let signer;
let contract;
let ownerAddress = null;
let currentUserAddress = null;

// --- 3. DOM ELEMENTS ---
// Sections
const connectSection = document.getElementById("connectSection");
const appSection = document.getElementById("appSection");
const adminLoginSection = document.getElementById("adminLoginSection");
const adminSection = document.getElementById("adminSection");

// Connect Section Elements
const connectButton = document.getElementById("connectButton");
const connectStatus = document.getElementById("connectStatus");
// Removed showAdminLoginButton - button moved to app section

// App Section Elements
const walletAddressDisplay = document.getElementById("walletAddress");
const loadReportsButton = document.getElementById("loadReportsButton");
const reportList = document.getElementById("reportList");
const promptTextInput = document.getElementById("promptText");
const promptFileInput = document.getElementById("promptFile");
const promptFileNameDisplay = document.getElementById("promptFileName"); // Added
const responseTextInput = document.getElementById("responseText");
const responseFileInput = document.getElementById("responseFile");
const responseFileNameDisplay = document.getElementById("responseFileName"); // Added
const chatLinkInput = document.getElementById("chatLinkInput");
const registerProofButton = document.getElementById("registerProofButton");
const registerStatusDisplay = document.getElementById("registerStatus");
const logoutButton = document.getElementById("logoutButton");
const showAdminLoginButtonApp = document.getElementById(
    "showAdminLoginButtonApp",
); // Added for button in App Header

// Admin Login Elements
const adminPasswordInput = document.getElementById("adminPassword");
const adminLoginButton = document.getElementById("adminLoginButton");
const adminLoginStatus = document.getElementById("adminLoginStatus");
const backToConnectButton = document.getElementById("backToConnectButton");

// Admin Section Elements
const adminLogoutButton = document.getElementById("adminLogoutButton");
// Remove withdraw elements if withdraw function removed from contract
// const withdrawButton = document.getElementById('withdrawButton');
// const withdrawStatusDisplay = document.getElementById('withdrawStatus');

// --- 4. EVENT LISTENERS ---
connectButton.addEventListener("click", connectWallet);
logoutButton.addEventListener("click", disconnectWallet);
loadReportsButton.addEventListener("click", loadReports);
registerProofButton.addEventListener("click", handleRegisterProof);
showAdminLoginButtonApp.addEventListener("click", showAdminLogin); // Listener for button in App Header
adminLoginButton.addEventListener("click", handleAdminLogin);
backToConnectButton.addEventListener("click", showConnectSection);
adminLogoutButton.addEventListener("click", showConnectSection);
// File input listeners to show filename
promptFileInput.addEventListener("change", () => {
    promptFileNameDisplay.textContent = promptFileInput.files[0]
        ? promptFileInput.files[0].name
        : "No file chosen";
});
responseFileInput.addEventListener("change", () => {
    responseFileNameDisplay.textContent = responseFileInput.files[0]
        ? responseFileInput.files[0].name
        : "No file chosen";
});
// Remove withdraw listener if function removed
// withdrawButton.addEventListener('click', withdrawSlashedFunds);

// --- 5. PAGE NAVIGATION ---
function showSection(sectionToShow) {
    [connectSection, appSection, adminLoginSection, adminSection].forEach(
        (s) => {
            if (s) s.style.display = "none";
        },
    );
    if (sectionToShow) sectionToShow.style.display = "block";
}
function showConnectSection() {
    showSection(connectSection);
    connectStatus.textContent = "";
    adminLoginStatus.textContent = "";
    adminPasswordInput.value = "";
}
function showAdminLogin() {
    showSection(adminLoginSection);
    adminLoginStatus.textContent = "";
}

// --- 6. IPFS UPLOAD ---
async function uploadToIPFS(fileBlob, fileName = "content.dat") {
    if (!PINATA_JWT)
        throw new Error("IPFS config missing (VITE_PINATA_JWT Secret)."); // Updated error msg
    const formData = new FormData();
    formData.append("file", fileBlob, fileName);
    formData.append("pinataMetadata", JSON.stringify({ name: fileName }));
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
    try {
        const res = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
                method: "POST",
                headers: { Authorization: `Bearer ${PINATA_JWT}` },
                body: formData,
            },
        );
        const resData = await res.json();
        if (!res.ok)
            throw new Error(
                `Pinata Error: ${resData.error?.reason || res.statusText}`,
            );
        console.log("IPFS Upload:", resData);
        return resData.IpfsHash;
    } catch (error) {
        console.error("IPFS Upload Error:", error);
        throw error;
    }
}

async function packageAndUploadInput(textInput, fileInput, baseFileName) {
    const text = textInput.value.trim();
    const file = fileInput.files[0];
    if (!text && !file) throw new Error(`Input required for ${baseFileName}`);
    if (text && !file) {
        const blob = new Blob([text], { type: "text/plain" });
        return await uploadToIPFS(blob, `${baseFileName}.txt`);
    } else if (!text && file) {
        return await uploadToIPFS(file, `${baseFileName}_${file.name}`);
    } else {
        const fileCid = await uploadToIPFS(
            file,
            `${baseFileName}_${file.name}`,
        );
        const data = { text: text, fileCid: fileCid, fileName: file.name };
        const blob = new Blob([JSON.stringify(data)], {
            type: "application/json",
        });
        return await uploadToIPFS(blob, `${baseFileName}_meta.json`);
    }
}

// --- 7. WALLET & CONTRACT INTERACTIONS ---
async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        connectStatus.textContent = "Please install MetaMask!";
        return;
    }
    connectStatus.textContent = "Connecting... Please approve in MetaMask.";
    connectButton.disabled = true;
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        currentUserAddress = await signer.getAddress();
        console.log("Account:", currentUserAddress);
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        try {
            ownerAddress = await contract.owner();
            console.log("Owner:", ownerAddress);
        } catch (ownerError) {
            console.error("Fetch Owner Error:", ownerError);
            connectStatus.textContent = "Error fetching owner.";
            connectButton.disabled = false;
            return;
        }
        showSection(appSection);
        walletAddressDisplay.textContent = `Connected: ${currentUserAddress.substring(0, 6)}...${currentUserAddress.substring(currentUserAddress.length - 4)}`;
        loadReportsButton.disabled = false;
        registerStatusDisplay.textContent = "";
        connectButton.disabled = false;
        await loadReports();
    } catch (error) {
        console.error("Connection Error:", error);
        connectStatus.textContent =
            "Connection failed. User rejected or error occurred.";
        connectButton.disabled = false;
        showConnectSection();
    }
}
function disconnectWallet() {
    provider = null;
    signer = null;
    contract = null;
    currentUserAddress = null;
    ownerAddress = null;
    walletAddressDisplay.textContent = "Not Connected";
    console.log("Disconnected");
    showConnectSection();
}

async function loadReports() {
    if (!contract) {
        console.error("Contract not init.");
        reportList.innerHTML = "<li>Error: Connect wallet first.</li>";
        return;
    }
    reportList.innerHTML =
        "<li><p>🔄 Loading proofs from the blockchain...</p></li>";
    loadReportsButton.disabled = true;
    try {
        // Corrected: Use getter for counter if using OZ Counters, or read public variable if defined
        // Assuming public reportCount variable exists from previous versions. If using OZ Counters, use contract._nextTokenId() or similar
        // const count = await contract.reportCount(); // Use this if you have public reportCount
        // Let's assume you need the NFT total supply if using standard OZ _tokenIdCounter without public getter
        // const count = await contract.nftContract.totalSupply();  Might need NFT contract instance if registry doesn't track count
        // OR if registry has its own count:
        // const count = await contract.getProofCount(); // Assuming a getter function getProofCount() exists

        // --- TEMPORARY FIX: Read _nextTokenId (requires making it public or adding a getter) ---
        // Let's assume a getter `getNextTokenId()` exists for this example
        // const countBigNum = await contract.getNextTokenId(); // Replace with your actual counter reading method
        // const numReports = countBigNum.toNumber();
        // --- END TEMP FIX ---

        // --- SAFER FIX: Iterate until proofData reverts (less efficient but works if no counter getter) ---
        // let numReports = 0;
        // try {
        //     while (true) {
        //         await contract.proofData(numReports); // Try to read data
        //         numReports++;
        //     }
        // } catch (e) {
        //     // Reached the end when reading proofData fails
        //     console.log("Found total proofs:", numReports);
        // }
        let numReports = 0;
        try {
            // 1. Get the address of the NFT contract from our Registry
            const nftContractAddress = await contract.nftContract();

            // 2. Define a minimal ABI for the 'ownerOf' function
            const nftContractABI = [
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "tokenId",
                            type: "uint256",
                        },
                    ],
                    name: "ownerOf",
                    outputs: [
                        { internalType: "address", name: "", type: "address" },
                    ],
                    stateMutability: "view",
                    type: "function",
                },
            ];

            // 3. Create a new contract object just for the NFT contract
            const nftContract = new ethers.Contract(
                nftContractAddress,
                nftContractABI,
                provider,
            );

            // 4. Loop by checking ownerOf(i) until it fails
            let i = 0;
            while (true) {
                try {
                    await nftContract.ownerOf(i);
                    // If ownerOf(i) succeeds, it means token 'i' exists
                    i++; // So we increment the count and check for the next token
                } catch (e) {
                    // If ownerOf(i) fails, it's because that token ID doesn't exist.
                    // This means the total number of tokens is 'i'.
                    break; // Exit the while loop
                }
            }
            numReports = i; // The total count is the number of tokens we found
            console.log("Found total proofs:", numReports);
        } catch (e) {
            // This catch block is for a *different* error, like if the
            // nftContractAddress itself was invalid.
            console.error("Error during proof count loop:", e);
            reportList.innerHTML =
                "<li>❌ Error fetching proof count. Check console.</li>";
            loadReportsButton.disabled = false;
            return;
        }
        // --- END SAFER FIX ---

        if (numReports === 0) {
            reportList.innerHTML =
                "<li><p>📬 No proofs registered yet.</p></li>";
            loadReportsButton.disabled = false;
            return;
        }
        reportList.innerHTML = "";
        for (let i = numReports - 1; i >= 0; i--) {
            // Newest first
            const report = await contract.proofData(i);
            const listItem = document.createElement("li");
            listItem.setAttribute("data-token-id", i);
            listItem.innerHTML = `
                <div>
                    <b>Proof NFT ID: ${i}</b><br>
                    <span class="author">Author: ${report.author.substring(0, 6)}...${report.author.substring(report.author.length - 4)}</span><br>
                    <span class="timestamp">Timestamp: ${new Date(report.timestamp.toNumber() * 1000).toLocaleString()}</span><br>
                    Prompt CID: <a href="${IPFS_GATEWAY}${report.promptCid}" target="_blank" title="${report.promptCid}">${report.promptCid.substring(0, 10)}...</a><br>
                    Content CID: <a href="${IPFS_GATEWAY}${report.contentCid}" target="_blank" title="${report.contentCid}">${report.contentCid.substring(0, 10)}...</a><br>
                    Metadata URI: <a href="${IPFS_GATEWAY}${report.metadataUri}" target="_blank" title="${report.metadataUri}">${report.metadataUri.substring(0, 10)}...</a><br>
                    ${report.optionalChatLink ? `Chat Link: <a href="${report.optionalChatLink}" target="_blank">View Chat</a><br>` : ""}
                    <div class="content-preview" id="preview-${i}">Loading preview...</div>
                </div>
                <p class="status-msg" id="status-${i}"></p>
                <hr style="margin: 10px 0;">`;
            reportList.appendChild(listItem);
            loadAndDisplayPreview(
                i,
                report.contentCid,
                listItem.querySelector(".content-preview"),
            );
        }
    } catch (error) {
        console.error("Load Reports Error:", error);
        reportList.innerHTML =
            "<li>❌ Error loading proofs. Check console.</li>";
    } finally {
        loadReportsButton.disabled = false;
    }
}

async function handleRegisterProof() {
    if (!contract || !signer) {
        alert("Connect wallet first.");
        return;
    }
    registerStatusDisplay.textContent =
        "🚀 Processing inputs & uploading to IPFS...";
    registerProofButton.disabled = true;
    let promptCid = "",
        contentCid = "",
        metadataJson = {},
        metadataCid = "";
    const optionalChatLink = chatLinkInput.value.trim();
    const authorAddress = await signer.getAddress();
    try {
        console.log("Uploading prompt...");
        promptCid = await packageAndUploadInput(
            promptTextInput,
            promptFileInput,
            "prompt",
        );
        console.log("Uploading content...");
        contentCid = await packageAndUploadInput(
            responseTextInput,
            responseFileInput,
            "content",
        );
        metadataJson = {
            name: `Autho.D.oX Proof #${Date.now()}`,
            description: "Immutable proof of AI content generation.",
            image:
                responseFileInput.files[0] &&
                /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(
                    responseFileInput.files[0].name,
                )
                    ? `ipfs://${contentCid}`
                    : null,
            attributes: [
                { trait_type: "Prompt CID", value: promptCid },
                { trait_type: "Content CID", value: contentCid },
                { trait_type: "Author", value: authorAddress },
                {
                    trait_type: "Timestamp",
                    value: Math.floor(Date.now() / 1000),
                },
                { trait_type: "Chat Link", value: optionalChatLink || "N/A" },
            ],
        };
        if (metadataJson.image === null) delete metadataJson.image;
        console.log("Uploading metadata JSON...");
        const metadataBlob = new Blob([JSON.stringify(metadataJson)], {
            type: "application/json",
        });
        metadataCid = await uploadToIPFS(metadataBlob, "metadata.json");
        registerStatusDisplay.textContent =
            "🚀 Sending transaction... Please confirm in MetaMask.";
        console.log(
            "Calling registerProof:",
            promptCid,
            contentCid,
            metadataCid,
            optionalChatLink,
        );
        // Corrected call based on final Registry contract
        const tx = await contract.registerProof(
            promptCid,
            contentCid,
            metadataCid,
            optionalChatLink,
        );
        registerStatusDisplay.textContent = `⏳ Transaction sent! Waiting... Hash: ${tx.hash.substring(0, 10)}...`;
        console.log("Tx Sent:", tx.hash);
        await tx.wait(1);
        registerStatusDisplay.textContent = "✅ Proof registered successfully!";
        console.log("Tx Confirmed!");
        promptTextInput.value = "";
        promptFileInput.value = null;
        responseTextInput.value = "";
        responseFileInput.value = null;
        chatLinkInput.value = "";
        promptFileNameDisplay.textContent = "No file chosen"; // Clear filename display
        responseFileNameDisplay.textContent = "No file chosen"; // Clear filename display
        await loadReports();
    } catch (error) {
        console.error("Register Proof Error:", error);
        let displayError = parseContractError(
            error,
            `Registration Error: ${error.message || "Unknown"}`,
        );
        registerStatusDisplay.textContent = displayError;
    } finally {
        registerProofButton.disabled = false;
    }
}

async function loadAndDisplayPreview(id, cid, previewElement) {
    if (!cid) {
        previewElement.innerHTML = "<small>No content CID.</small>";
        return;
    }
    const url = `${IPFS_GATEWAY}${cid}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const contentType = response.headers.get("content-type");
        if (contentType?.startsWith("image/")) {
            previewElement.innerHTML = `<img src="${url}" alt="IPFS Preview ${id}" >`;
        } else if (contentType?.includes("json")) {
            const jsonData = await response.json();
            let html = "<small><b>Preview:</b><br>";
            if (jsonData.text)
                html += `<i>Text:</i> ${jsonData.text.substring(0, 100)}${jsonData.text.length > 100 ? "..." : ""}<br>`;
            if (jsonData.fileCid)
                html += `<i>File:</i> <a href="${IPFS_GATEWAY}${jsonData.fileCid}" target="_blank">${jsonData.fileName || "Linked File"}</a>`;
            previewElement.innerHTML = html + "</small>";
        } else if (contentType?.startsWith("text/")) {
            const text = await response.text();
            previewElement.innerHTML = `<small><b>Preview:</b><br>${text.substring(0, 150)}${text.length > 150 ? "..." : ""}</small>`;
        } else {
            previewElement.innerHTML = `<small><i>Content:</i> <a href="${url}" target="_blank">View File</a></small>`;
        }
    } catch (error) {
        console.error(`Preview Error (CID ${cid}):`, error);
        previewElement.innerHTML = `<small style="color:red;">Error loading preview.</small>`;
    }
}

// --- 8. ADMIN FUNCTIONS ---
function handleAdminLogin() {
    const pass = adminPasswordInput.value;
    if (pass === ADMIN_PASSWORD) {
        if (
            currentUserAddress &&
            ownerAddress &&
            currentUserAddress.toLowerCase() === ownerAddress.toLowerCase()
        ) {
            showSection(adminSection); // withdrawStatusDisplay.textContent = ''; // Clear status if needed
        } else {
            adminLoginStatus.textContent =
                "Error: Connected wallet is not owner.";
        }
    } else {
        adminLoginStatus.textContent = "Incorrect code.";
    }
    adminPasswordInput.value = "";
}
// Remove withdrawSlashedFunds if not in contract
/*
async function withdrawSlashedFunds() {
    // ... implementation ...
}
*/

// --- UTILITY ---
function parseContractError(
    error,
    defaultMessage,
    specific1 = null,
    specific2 = null,
) {
    console.log("Raw error:", error);
    let msg = defaultMessage;
    if (error.reason) msg = error.reason;
    else if (error.error?.message) msg = error.error.message;
    else if (error.data?.message) msg = error.data.message;
    else if (error.message) msg = error.message;
    msg = msg
        .replace("execution reverted: ", "")
        .replace(
            "VM Exception while processing transaction: reverted with reason string ",
            "",
        )
        .replace("Internal JSON-RPC error.", "")
        .replace(/error=.*{(.*)}.*}, method=.*$/, "$1")
        .replace(/\"message\":\"(.*?)\".*$/, "$1");
    msg = msg
        .replace(/^Error\([^)]*\)\s*/, "")
        .replace(/^Panic\([^)]*\)\s*/, "")
        .trim();
    if (specific1 && msg.toLowerCase().includes(specific1.toLowerCase()))
        return `Error: ${specific1}`;
    if (specific2 && msg.toLowerCase().includes(specific2.toLowerCase()))
        return `Error: ${specific2}`;
    if (error.code === 4001 || msg.includes("User denied"))
        return "Transaction rejected.";
    if (error.code === -32000 && msg.includes("insufficient funds"))
        return "Error: Insufficient funds for gas.";
    return `Error: ${msg || defaultMessage}`;
}

// --- INITIAL STATE ---
showConnectSection(); // Start on connect page
