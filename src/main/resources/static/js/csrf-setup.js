;(function (global) {
    // --- 공통: 토큰 읽기 ---
    function getCsrfToken() {
        var m = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
        return m ? decodeURIComponent(m[1]) : null;
    }

    // fetch 등에서 필요할 때 사용할 수 있도록 노출
    global.__getCsrfToken = getCsrfToken;

    // --- axios 전역(또는 개별 인스턴스)용 설정 함수 ---
    function setupCsrfOnAxios(axiosInstance) {
        if (!axiosInstance) return;

        // 이미 장착되어 있다면 중복 등록 막기
        if (axiosInstance.__csrfInterceptorInstalled) return;

        axiosInstance.defaults.withCredentials = true;

        var id = axiosInstance.interceptors.request.use(function (config) {
            var method = (config && config.method ? String(config.method) : 'get').toLowerCase();
            if (method === 'post' || method === 'put' || method === 'delete' || method === 'patch') {
                var token = getCsrfToken();
                if (token) {
                    config.headers = config.headers || {};
                    if (!('X-XSRF-TOKEN' in config.headers)) {
                        config.headers['X-XSRF-TOKEN'] = token;
                    }
                }
            }
            return config;
        });

        axiosInstance.__csrfInterceptorInstalled = true;
        axiosInstance.__csrfInterceptorId = id;
    }

    // 전역 axios 자동 장착 (있을 때만)
    if (typeof global !== 'undefined' && global.axios) {
        setupCsrfOnAxios(global.axios);
    }

    // --- fetch 유틸 (선택) ---
    function csrfFetch(input, init) {
        init = init || {};
        var method = ((init.method || 'GET') + '').toUpperCase();

        if (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
            var token = getCsrfToken();
            if (token) {
                init.headers = init.headers || {};
                // 기존 헤더가 Map/Headers 가 아니라 plain object 라는 가정(일반 케이스)
                if (!(init.headers['X-XSRF-TOKEN'] || init.headers['x-xsrf-token'])) {
                    init.headers['X-XSRF-TOKEN'] = token;
                }
            }
            // 쿠키 동봉
            if (init.credentials == null) {
                init.credentials = 'include';
            }
        }
        return fetch(input, init);
    }

    // 전역 노출(선택)
    global.setupCsrfOnAxios = setupCsrfOnAxios;
    global.csrfFetch = csrfFetch;

    // ESM/CommonJS 환경 지원(번들러 사용 시)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { setupCsrfOnAxios, csrfFetch, __getCsrfToken: getCsrfToken };
    } else if (typeof define === 'function' && define.amd) {
        define(function () { return { setupCsrfOnAxios, csrfFetch, __getCsrfToken: getCsrfToken }; });
    }
})(typeof window !== 'undefined' ? window : this);