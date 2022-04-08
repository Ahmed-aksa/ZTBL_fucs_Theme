import {Injectable} from '@angular/core';
import {BaseRequestModel} from '../models/base_request.model';
import * as CryptoJS from 'crypto-js';
import {throwError} from 'rxjs';
import * as Forge from 'node-forge';
import {environment} from 'environments/environment';

@Injectable({providedIn: 'root'})
export class EncryptDecryptService {
    public request = new BaseRequestModel();
    encryptSecretKey: string;

    constructor() {
        this.encryptSecretKey = environment.AesKey;
    }

    getKey() {
        let key = this.decryptStorageData(localStorage.getItem("ztblKey"));
        if (key && key.length == 40) {

            key = key.substring(0, 8).concat(key.substring(16, 40));
            return key;
        } else {
            throwError;
        }
    }

    getUDID() {
        let udid = this.decryptStorageData(localStorage.getItem("ztbludid"));
        if (udid) {
            return udid;
        } else {
            throwError;
        }
    }

    AESencrypt(keys, value) {
        if (!keys) {
            keys = this.getKey()
        }
        var key = CryptoJS.enc.Utf8.parse(keys);
        var iv = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        var iv1 = CryptoJS.lib.WordArray.create(iv);
        var encrypted = CryptoJS.AES.encrypt(
            CryptoJS.enc.Utf8.parse(JSON.stringify(value)),
            key,
            {
                keySize: 256 / 8,
                iv: iv1,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );

        return encrypted.toString();
    }

    //The get method is use for decrypt the value.
    AESdecrypt(keys, value) {
        if (!value) {
            return;
        }
        if (!keys) {
            keys = this.getKey()
        }
        var key = CryptoJS.enc.Utf8.parse(keys);
        var iv = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        var iv1 = CryptoJS.lib.WordArray.create(iv);
        var decrypted = CryptoJS.AES.decrypt(value, key, {
            keySize: 256 / 8,
            iv: iv1,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    RSAencrypt(key: any) {
        var rsa1 = Forge.pki.publicKeyFromPem(environment.publicRSAKey);
        var encrypt = (rsa1.encrypt(key));
        encrypt = window.btoa(encrypt);
        return encrypt;
    }

    encryptStorageData(data) {

        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
        } catch (e) {
            console.log(e);
        }
    }

    decryptStorageData(data) {

        try {
            if (data) {
                const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
                if (bytes.toString()) {
                    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                }
                return data;
            }
            return null;
        } catch (e) {
            console.log(e);
        }
    }

}
