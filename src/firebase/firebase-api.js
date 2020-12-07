import { firebaseConfig, auth } from "./firebase";
import { Utils } from '../utils';
export class FirebaseAPI {
    static async get(collection, { orderBy, startAt, endAt, limitToFirst, limitToLast }) {
        let url = `${firebaseConfig.databaseURL}/${collection}.json`
        if (orderBy) {
            url += `?orderBy="${orderBy}"`
            if (limitToFirst) {
                url += `&limitToFirst=${limitToFirst}`
            }
            if (limitToLast) {
                url += `&limitToLast=${limitToLast}`
            }
            if (startAt) {
                url += `&startAt="${startAt}"`
            }
            if (endAt) {
                url += `&endAt="${endAt}"`
            }
        }
        url = await addToken(`${url}&`)
        const response = await fetch(url);
        const data = await response.json()
        if (data) {
            return Object.values(data).sort((a, b) => {
                return b[orderBy] - a[orderBy]
            });
        }
        return data;
    }
    static async findById(collection, id) {
        let url = `${firebaseConfig.databaseURL}/${collection}.json?orderBy="id"&equalTo="${id}"&`
        url = await addToken(url)
        const response = await fetch(url);
        const data = await response.json()
        const keys = Object.keys(data)
        if (keys && keys.length > 0) {
            return data[keys[0]];
        }
        return null
    }
    static async add(collection, object) {
        let url = `${firebaseConfig.databaseURL}/${collection}/${object.id}.json?`
        url = await addToken(url)
        const response = await fetch(
            url, {
            method: "PUT",
            body: JSON.stringify(object)
        }
        );

        return await response.json();
    }

    static async update(collection, payload) {
        let url = `${firebaseConfig.databaseURL}/${collection}/${payload.id}.json?`
        url = await addToken(url)
        const response = await fetch(
            url, {
            method: "PATCH",
            body: JSON.stringify(payload)
        });

        return await response.json();
    }

    static async delete(databaseName, payload) {
        let url = `${firebaseConfig.databaseURL}/${databaseName}/${payload.id}.json?`
        url = await addToken(url)
        const response = await fetch(
            url, {
            method: "DELETE"
        });

        return await response.json();
    }
    // static async uploadFile(collection, file, name) {
    //     return await storage
    //         .child(`${collection}/${name}`)
    //         .put(file)
    // }
    // static async downloadFile(collection, name) {
    //     return await storage
    //         .child(`${collection}/${name}`)
    //         .getDownloadURL()
    // }
    // static async deleteFile(collection, name) {
    //     return await storage
    //         .child(`${collection}/${name}`)
    //         .delete()
    // }
}
async function addToken(url) {
    const token = await auth.currentUser.getIdToken()
    return url += `auth=${token}`
}