import axios from "axios";
//const baseUrl = 'http://localhost:5001/agreeda/us-central1/api'
const baseUrl = 'https://us-central1-agreeda.cloudfunctions.net/api'

export class ApiService {
    async getData(url, headers, cancelToken, data) {
        const config = {
            headers: {
                'Access-Control-Allow-Origin':'*',
                ...(headers || {})
            },
        };
        if (data) {
            config.data = data;
        }
        if (cancelToken && cancelToken.token) {
            config.cancelToken = cancelToken.token;
        }
        const response = await axios.get(url, config).catch((err) => {
            data = {error: 'something went wrong'};
        });
        return data || response.data;
    }


    async postMethod(url, data, headers, cancelToken) {
        const config = {
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Content-Type': 'application/json'
            }
        };
        if (cancelToken && cancelToken.token) {
            config.cancelToken = cancelToken.token;
        }
        let resData = '';
        const response = await axios.post(url, data, config).catch(thrown => {
            if (thrown.toString() === 'Cancel') {
                resData = 'cancel';
            } else {
                resData = {error: 'something went wrong'};;
            }
        });
        return resData || response.data;
    }

    async putMethod(url, data, headers) {
        const config = {
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Content-Type': 'application/json'
            }
        };
        let resData = '';
        const response = await axios.put(url, data, config).catch(err => {
            resData = {error: 'something went wrong'};
        });
        return resData || response.data;
    }

    async deleteMethod(url, data, headers) {
        const config = {
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Content-Type': 'application/json'
            },
            data
        };
        let resData = '';
        const response = await axios.delete(url, config).catch(err => {
            resData = {error: 'something went wrong'};
        });
        return resData || response.data;
    }
    async getJobList(loginUserId){
        return await this.getData(`${baseUrl}/project-list?userId=${loginUserId}`);
    }
    async getJobDetails(id, loginUserId){
        return await this.getData(`${baseUrl}/project-list-details/${id}?userId=${loginUserId}`);
    }
    async getJobListByUser(id){
        return await this.getData(`${baseUrl}/project-list/${id}`);
    }
    async getUserDetails(id){
        return await this.getData(`${baseUrl}/user-details/${id}`);
    }
    async getCardList(id){
        return await this.getData(`${baseUrl}/card-list/${id}`);
    }
    async forgotPasswordCheckEmail(email){
        return await this.getData(`${baseUrl}/forgot-password-check-email/${email}`);
    }
    async login(payload){
        return await this.postMethod(`${baseUrl}/login`, payload);
    }
    async createUser(payload){
        return await this.postMethod(`${baseUrl}/create-user`, payload);
    }
    async updateUserDetails(payload, id){
        return await this.postMethod(`${baseUrl}/update-user-details/${id}`, payload);
    }
    async paymentMethod(payload){
        return await this.postMethod(`${baseUrl}/payment-method`, payload);
    }

    async paymentMethodCreate(payload){
        return await this.postMethod(`${baseUrl}/payment-method-create`, payload);
    }
    async activateCompanyAccount(id){
        return await this.putMethod(`${baseUrl}/activate-company-account/${id}`);
    }
    async forgetPassword(id, payload){
        return await this.putMethod(`${baseUrl}/forget-password/${id}`, payload);
    }
    async logout(payload){
        return await this.postMethod(`${baseUrl}/logout`, payload);
    }

    async defaultCard(id, userId,payload){
        return await this.putMethod(`${baseUrl}/default-card/${id}/${userId}`, payload);
    }
    async removeCard(id){
        return await this.deleteMethod(`${baseUrl}/remove-card/${id}`);
    }

}