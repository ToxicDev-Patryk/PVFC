function charToNum(a) {
    return Array.from(a).map(b => b.charCodeAt(0).toString().padStart(3, '0')).join('');
}

function numToChar(a) {
    return Array.from({ length: a.length / 3 }, (_, i) => String.fromCharCode(parseInt(a.slice(i * 3, i * 3 + 3)))).join('');
}

function generateKeys(a, b) {
    return Array.from({ length: a }, () => generateKey(b));
}

function generateKey(a) {
    return Array.from({ length: a }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
}

const c = "0123456789abcdefghijklmnopqrstuvwxyz";

function encrypt(x, y) {
    let z = '';
    const a = Math.max(...y.map(b => b.length));
    for (let d = 0; d < a; d += 2) {
        for (const e of y) {
            if (d < e.length) {
                z += e.slice(d, d + 2);
            }
        }
    }

    const f = Array.from({ length: z.length / 2 }, (_, g) => parseInt(z.slice(g * 2, g * 2 + 2), 16));
    const h = Array.from({ length: x.length / 3 }, (_, i) => parseInt(x.slice(i * 3, i * 3 + 3)));

    for (let j = 0; j < h.length; j++) {
        let k = h[j];
        k = (k + f[j % f.length]) % 256;
        k = k ^ f[(j + 1) % f.length];
        const l = (f[j % f.length] + j) % 8;
        k = ((k << l) | (k >>> (8 - l))) & 0xFF;
        k = k ^ ((f[j % f.length] + j) % 256);
        h[j] = k;
    }

    const m = h.map(n => n.toString().padStart(3, '0')).join('');
    const o = m.split('');

    for (let p = 0; p < m.length; p++) {
        const q = (p + f[p % f.length]) % m.length;
        [o[p], o[q]] = [o[q], o[p]];
    }

    const r = o.join('');
    let s = "";

    for (let t = 0; t < r.length; t += 3) {
        const u = r.slice(t, t + 3);
        const v = parseInt(u);
        s += c[v % 36];
        s += c[Math.floor(v / 36) % 36];
    }

    return s;
}

function decrypt(x, y) {
    let z = "";

    for (let a = 0; a < x.length; a += 2) {
        const b = x.slice(a, a + 2);
        const d = c.indexOf(b[0]) + c.indexOf(b[1]) * 36;
        z += d.toString().padStart(3, '0');
    }

    let e = '';
    const f = Math.max(...y.map(g => g.length));
    for (let h = 0; h < f; h += 2) {
        for (const i of y) {
            if (h < i.length) {
                e += i.slice(h, h + 2);
            }
        }
    }

    const j = Array.from({ length: e.length / 2 }, (_, k) => parseInt(e.slice(k * 2, k * 2 + 2), 16));
    const l = z.split('');

    for (let m = l.length - 1; m >= 0; m--) {
        const n = (m + j[m % j.length]) % l.length;
        [l[m], l[n]] = [l[n], l[m]];
    }

    const o = l.join('');
    const p = Array.from({ length: o.length / 3 }, (_, q) => parseInt(o.slice(q * 3, q * 3 + 3)));

    for (let r = p.length - 1; r >= 0; r--) {
        let s = p[r];
        s = s ^ ((j[r % j.length] + r) % 256);
        const t = (j[r % j.length] + r) % 8;
        s = ((s >>> t) | (s << (8 - t))) & 0xFF;
        s = s ^ j[(r + 1) % j.length];
        s = (s - j[r % j.length] + 256) % 256;
        p[r] = s;
    }

    return p.map(v => v.toString().padStart(3, '0')).join('');
}

const plaintext = "Hello, World!";
const numKeys = 3;
const keyLength = 16;

console.log("Original text:", plaintext);

const numericText = charToNum(plaintext);
console.log("Numeric representation:", numericText);

const keys = generateKeys(numKeys, keyLength);
console.log("Generated keys:", keys);

const encryptedText = encrypt(numericText, keys);
console.log("Encrypted text:", encryptedText);

const decryptedNumeric = decrypt(encryptedText, keys);
const decryptedText = numToChar(decryptedNumeric);
console.log("Decrypted text:", decryptedText);

console.log("Decryption successful:", plaintext === decryptedText);
