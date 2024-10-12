import random

def char_to_num(a):
    return ''.join(str(ord(b)).zfill(3) for b in a)

def num_to_char(a):
    return ''.join(chr(int(a[b:b+3])) for b in range(0, len(a), 3))

def generate_keys(a, b):
    return [generate_key(b) for _ in range(a)]

def generate_key(a):
    return ''.join(hex(random.randint(0, 255))[2:].zfill(2) for _ in range(a))

c = "0123456789abcdefghijklmnopqrstuvwxyz"

def encrypt(x, y):
    z = ''
    a = max(len(b) for b in y)
    for d in range(0, a, 2):
        for e in y:
            if d < len(e):
                z += e[d:d+2]
    
    f = [int(z[g:g+2], 16) for g in range(0, len(z), 2)]
    h = [int(x[i:i+3]) for i in range(0, len(x), 3)]
    
    for j in range(len(h)):
        k = h[j]
        k = (k + f[j % len(f)]) % 256
        k = k ^ f[(j + 1) % len(f)]
        l = (f[j % len(f)] + j) % 8
        k = ((k << l) | (k >> (8 - l))) & 0xFF
        k = k ^ ((f[j % len(f)] + j) % 256)
        h[j] = k
    
    m = ''.join(f"{n:03d}" for n in h)
    o = list(m)
    
    for p in range(len(m)):
        q = (p + f[p % len(f)]) % len(m)
        o[p], o[q] = o[q], o[p]
    
    r = ''.join(o)
    s = ""
    
    for t in range(0, len(r), 3):
        u = r[t:t+3]
        v = int(u)
        s += c[v % 36]
        s += c[(v // 36) % 36]
    
    return s

def decrypt(x, y):
    z = ""
    
    for a in range(0, len(x), 2):
        b = x[a:a+2]
        d = c.index(b[0]) + c.index(b[1]) * 36
        z += f"{d:03d}"
    
    e = ''
    f = max(len(g) for g in y)
    for h in range(0, f, 2):
        for i in y:
            if h < len(i):
                e += i[h:h+2]
    
    j = [int(e[k:k+2], 16) for k in range(0, len(e), 2)]
    l = list(z)
    
    for m in range(len(z) - 1, -1, -1):
        n = (m + j[m % len(j)]) % len(z)
        l[m], l[n] = l[n], l[m]
    
    o = ''.join(l)
    p = [int(o[q:q+3]) for q in range(0, len(o), 3)]
    
    for r in range(len(p) - 1, -1, -1):
        s = p[r]
        s = s ^ ((j[r % len(j)] + r) % 256)
        t = (j[r % len(j)] + r) % 8
        s = ((s >> t) | (s << (8 - t))) & 0xFF
        s = s ^ j[(r + 1) % len(j)]
        s = (s - j[r % len(j)]) % 256
        p[r] = s
    
    u = ''.join(f"{v:03d}" for v in p)
    return u

if __name__ == "__main__":
    input_str = input("Enter a string: ")
    output_num = char_to_num(input_str)
    print("Numerical Representation:", output_num)

    num_keys = 4
    key_length = 16
    keys = generate_keys(num_keys, key_length)
    print("Generated Keys:", keys)

    encrypted_hex = encrypt(output_num, keys)
    print("Encrypted:", encrypted_hex)

    decrypted_num = decrypt(encrypted_hex, keys)
    print("Decrypted Numerical Representation:", decrypted_num)

    decrypted_str = num_to_char(decrypted_num)
    print("Decrypted String:", decrypted_str)
