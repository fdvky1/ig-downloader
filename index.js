import fetch from "node-fetch";
import FormData from "form-data";


function download(url){
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append("url", url);
        form.append("action", "post")
        form.append("lang", "id")

        fetch("https://snapinsta.app/action2.php", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": `multipart/form-data; boundary=${form.getBoundary()}`,
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "Referer": "https://snapinsta.app/id",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": form,
        "method": "POST"
        }).then(async(res) => {
            if(res.status !== 200) return reject({status: res.status});
            const text = await res.text();
            const [h, u, n, t, e, r] = text.split("}(")[1].split("))")[0]?.replace(/"/g, "").split(",")
            const dec = hunter(h.split(""), u, n.split(""), t, e, r)
            const urls = dec.match(/<a href=\\"(https?:\/\/[\w\.\/\-&?=]+)/g)
            if(!urls) return reject({message: "failed to get download url, please check again your link"});
            resolve({status: 200, result: urls.map(v => v.replace("<a href=\\\"", ""))})
        })
    })
}

//original code from snapinsta
function _0xe17c(d, e, f) {
    var g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/' ['split']('');
    var h = g['slice'](0, e);
    var i = g['slice'](0, f);
    var j = d['split']('')['reverse']()['reduce'](function(a, b, c) {
        if (h['indexOf'](b) !== -1) return a += h['indexOf'](b) * (Math['pow'](e, c))
    }, 0);
    var k = '';
    while (j > 0) {
        k = i[j % f] + k;
        j = (j - (j % f)) / f
    }
    return k || '0'
  }
  function hunter(h, u, n, t, e, r) {
    r = "";
    for (var i = 0, len = h.length; i < len; i++) {
        var s = "";
        while (h[i] !== n[e]) {
            s += h[i];
            i++
        }
        for (var j = 0; j < n.length; j++) s = s.replace(new RegExp(n[j], "g"), j);
        r += String.fromCharCode(_0xe17c(s, e, 10) - t)
    }
    return decodeURIComponent(escape(r))
  }

export default download;