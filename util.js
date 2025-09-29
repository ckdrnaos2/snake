// https://ckdrnaos2.github.io/snake/util.js

async function fetchPublicKey() {
  const res = await fetch("http://host8.dreamhack.games:10631/publicKey");
  return await res.text();
}


async function getChar() {
  const res = await fetch("http://host8.dreamhack.games:10631/char");
  return await res.text();
}

async function encryptAndSend(event) {
  event.preventDefault();

  const form = document.getElementById("Login");
  const formData = new FormData(form);

  const publicKeyPem = await fetchPublicKey();
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const chr = await getChar();

  const encryptedData = {};

  for (const [key, value] of formData.entries()) {
    const utf8 = forge.util.encodeUtf8(chr+value);
    const encrypted = publicKey.encrypt(utf8, "RSA-OAEP");
    const hex = forge.util.bytesToHex(encrypted);
    encryptedData[key] = hex;
  }
  
  const response = await fetch(
  `http://host8.dreamhack.games:10631/login?id=${encodeURIComponent(encryptedData["id"])}&password=${encodeURIComponent(encryptedData["password"])}`,
  {
    method: "GET"
  }
);

  const result = await response.json();
  
  if (!result.message.includes("Incorrect")) {
	window.location.href = `http://host8.dreamhack.games:10631/result?id=${encodeURIComponent(result.message)}`;
} else {
	alert(result.message);
}
}
