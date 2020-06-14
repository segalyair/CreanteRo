import { auth } from '../firebase/firebase';
export class MarketService {
    static async get() {
        return await fetch(`${process.env.API_URL}/market/get`, {
            method: 'get',
            headers: new Headers({
                'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
            })
        })
    }
}