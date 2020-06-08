import { auth } from '../firebase/firebase';
export class MerchantService {
    static async addProduct(formData) {
        return await fetch(`${process.env.API_URL}/merchant/add`, {
            method: 'post',
            headers: new Headers({
                'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
            }),
            body: formData
        })
    }
}