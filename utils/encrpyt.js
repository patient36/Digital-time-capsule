import crypto from 'crypto';

function deriveKey(customKey, salt) {
    return crypto.pbkdf2Sync(customKey, salt, 100000, 32, 'sha256');
}

function encrypt(text, customKey) {
    const salt = crypto.randomBytes(16);
    const key = deriveKey(customKey, salt);
    const nonce = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('chacha20-poly1305', key, nonce, { authTagLength: 16 });
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    return `${salt.toString('hex')}:${nonce.toString('hex')}:${encrypted}:${tag.toString('hex')}`;
}

function decrypt(ciphertext, customKey) {
    const [saltHex, nonceHex, encryptedText, tagHex] = ciphertext.split(':');
    const salt = Buffer.from(saltHex, 'hex');
    const nonce = Buffer.from(nonceHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const key = deriveKey(customKey, salt);
    const decipher = crypto.createDecipheriv('chacha20-poly1305', key, nonce, { authTagLength: 16 });
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export { encrypt, decrypt }