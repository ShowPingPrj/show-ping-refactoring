/* === CSRF auto attach (ES5 safe) === */
(function () {
    function getCsrfToken() {
        var m = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
        return m ? decodeURIComponent(m[1]) : null;
    }

    // fetch에서 필요할 때 꺼내 쓰도록 노출
    window.__getCsrfToken = getCsrfToken;

    if (typeof window !== 'undefined' && window.axios) {
        axios.defaults.withCredentials = true; // 모든 axios 요청에 쿠키 포함

        axios.interceptors.request.use(function (config) {
            var method = (config && config.method ? String(config.method) : 'get').toLowerCase();
            if (method === 'post' || method === 'put' || method === 'delete' || method === 'patch') {
                var token = getCsrfToken();
                if (token) {
                    config.headers = config.headers || {};
                    if (!config.headers['X-XSRF-TOKEN']) {
                        config.headers['X-XSRF-TOKEN'] = token; // CSRF 헤더 자동 첨부
                    }
                }
            }
            return config;
        });
    }
})();


(async function() {
    try {
        const response = await axios.get("/api/live/live-info", {
            withCredentials: true
        });

        const data = response.data;

        if (typeof data !== "undefined" && data !== "") {
            streamInfo = true;
            streamNo = data.streamNo;
            // 기등록된 방송 제목
            document.getElementById("broadcastTitle").value = data.streamTitle;
            // 기등록된 방송 설명
            document.getElementById("broadcastDesc").value = data.streamDescription;

            // 기등록된 방송 상품
            document.querySelector(".product-img").src = data.productImg;
            document.querySelector(".product-info").id = data.productNo;
            document.querySelector(".product-name").textContent = data.productName;
            document.querySelector(".product-origin-price").textContent = data.productPrice;

            // 기등록된 상품 할인율
            document.getElementById("discountRate").value = data.productSale;
        } else {
            document.getElementById("broadcastTitle").value = "";
            document.getElementById("broadcastDesc").value = "";
            document.querySelector(".product-img").src = "";
            document.getElementById("discountRate").textContent = 0;
        }

        const event = new CustomEvent('dataLoaded');
        window.dispatchEvent(event);
    } catch (error) {
        console.error("데이터 로딩 오류", error);
    }
})();