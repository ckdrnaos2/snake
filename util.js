// https://ckdrnaos2.github.io/snake/util.js

async function fetchPublicKey() {
  const res = await fetch("http://host8.dreamhack.games:10006/publicKey");
  return await res.text();
}


async function getChar() {
  const res = await fetch("http://host8.dreamhack.games:10006/char");
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
	  const bValue = bbtoa(value);
    const utf8 = forge.util.encodeUtf8(chr+bValue);
    const encrypted = publicKey.encrypt(utf8, "RSA-OAEP");
    const hex = forge.util.bytesToHex(encrypted);
    encryptedData[key] = hex;
  }
  
  const response = await fetch(
  `http://host8.dreamhack.games:10006/login?id=${encodeURIComponent(encryptedData["id"])}&password=${encodeURIComponent(encryptedData["password"])}`,
  {
    method: "GET"
  }
);

  const result = await response.json();
  
  if (!result.message.includes("Incorrect")) {
	window.location.href = `http://host8.dreamhack.games:10006/result?id=${encodeURIComponent(result.message)}`;
} else {
	alert(result.message);
}
}


function bbtoa(input) {
	
  const chars = "ABCDEFGHIJKLMZYXWVUTSRQPONabcdefghijklmzyxwvutsrqpon0123456789+/=";	
  let str = input;
  let output = "";

  for (let block = 0, charCode, idx = 0, map = chars;
       str.charAt(idx | 0) || (map = "=", idx % 1);
       output += map.charAt(63 & (block >> (8 - (idx % 1) * 8)))) {

    charCode = str.charCodeAt(idx += 3/4);
	if ((charCode ^ 0x2A) === 13) charCode = 0x60;

    block = (block << 8) | charCode;
  }

  return output;
}
