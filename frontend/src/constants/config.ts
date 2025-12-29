const getApiBaseUrl = () => {
    const hostname = window.location.hostname;

    if (hostname.startsWith('10.') || hostname.startsWith('192.168.') || hostname === 'localhost') {
        return 'http://10.10.1.1:5000/';
    }

    return 'http://212.42.97.122:5000/';
};

export const API_URL = 'http://145.223.98.93:5016/';
export const API_TEMPLATE_URL_GO = "http://localhost:8080/api/v1";
export const API_KEY_2GIS = 'de885d35-ee6d-4a79-8ec7-4ec3a94b97bf';
export const FRONT_URL ="http://eo.bga.kg";