from Crypto.Cipher import XOR
import base64

KEY = "spiderweb"


def encrypt(plaintext):
    cipher = XOR.new(KEY)
    return base64.b64encode(cipher.encrypt(plaintext))


def decrypt(ciphertext):
    cipher = XOR.new(KEY)
    return cipher.decrypt(base64.b64decode(ciphertext))
