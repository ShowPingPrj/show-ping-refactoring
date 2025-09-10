let currentPage = 0;
const pageSize = 10;
let loading = false;
let isLast = false;

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadWatchHistory();
        }
    });
}, {rootMargin: "200px"});

document.addEventListener("DOMContentLoaded", function () {
    loadWatchHistory();
    observer.observe(document.getElementById("sentinel"));
});

function loadWatchHistory() {
    if (loading || isLast) {
        return;
    }
    loading = true;

    axios.get(`/api/watch/history/list/page`, {
        params: {
            pageNo: currentPage,
            pageSize: pageSize,
            sort: "recent",
        },
        withCredentials: true // 쿠키 인증 방식
    })
        .then(response => {
            const {content, pageInfo} = response.data;
            const tableBody = document.querySelector(".history-items tbody");

            content.forEach(item => {
                const date = new Date(item.watchTime);
                const watchDate = date.toLocaleDateString();
                const row = `
                    <tr>
                        <td class="product-order">
                            <img class="product-img" src="${item.productImg}" alt="${item.productName}">
                        </td>
                        <td class="stream-title" data-stream-title="${item.streamTitle}">
                            ${item.streamTitle}
                        </td>
                        <td class="product-name" data-product-name="${item.productName}">
                            ${item.productName}
                        </td>
                        <td class="product-price" data-product-price="${item.productPrice}">
                            ${(item.productPrice).toLocaleString('ko-KR')}원
                        </td>
                        <td class="watch-time" data-stream-time="${item.watchTime}">
                            ${watchDate}
                        </td>
                        <td>
                            <button class="watch-button" data-stream-no="${item.streamNo}">시청</button>
                        </td>
                    </tr>
                `;

                tableBody.insertAdjacentHTML("beforeend", row);
            });

            // 동적으로 추가된 시청 버튼에 이벤트 리스너 추가
            document.querySelectorAll(".watch-button").forEach(button => {
                button.addEventListener("click", function() {
                    const streamNo = this.getAttribute("data-stream-no");
                    if (streamNo) {
                        window.location.href = `/watch/vod/${streamNo}`;
                    }
                });
            });

            currentPage++;
            isLast = pageInfo.last;
            loading = false;
        })
        .catch(error => {
            console.error("시청 이력 데이터를 불러오는 중 오류 발생:", error);
        });
}