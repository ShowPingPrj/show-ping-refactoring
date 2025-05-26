document.addEventListener("DOMContentLoaded", function () {
    // ShowPing 로고 클릭 시 메인 페이지로 이동
    const showPingText = document.querySelector("h1");
    if (showPingText) {
        showPingText.style.cursor = "pointer";
        showPingText.addEventListener("click", function () {
            window.location.href = "/";
        });
    }

    // 2FA 입력폼에서 Enter 키를 눌렀을 때 인증 버튼 클릭
    const totpInput = document.getElementById("totpCode");
    if (totpInput) {
        totpInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // 기본 엔터 키 동작 방지
                verifyTOTP(event); // 인증 함수 호출
            }
        });
    }

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBackNavigation);
});

// 로그인 함수 (현재는 일단 관리자 사용자 할것없이 바로 로그인)
async function login(event) {
    event.preventDefault();

    const memberId = document.getElementById("memberId").value;
    const password = document.getElementById("memberPassword").value;

    try {
        const response = await axios.post("/api/auth/login", {
            memberId: memberId,
            password: password
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("로그인 응답:", response.data);

        if (response.data.accessToken) {
            sessionStorage.setItem("accessToken", response.data.accessToken);

            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        } else {
            Swal.fire({
                icon: "error",
                title: "로그인 실패",
                text: "아이디 또는 비밀번호를 확인하세요."
            });
        }
    } catch (error) {
        console.error("로그인 요청 실패:", error.response ? error.response.data : error);
        Swal.fire({
            icon: "error",
            title: "로그인 실패",
            text: "아이디 또는 비밀번호를 확인하세요."
        });
    }
}

// 뒤로가기 방지 함수
function preventBackNavigation() {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
}

// ✅ SweetAlert2 적용한 verifyTOTP 예시
/*
async function verifyTOTP(event) {
    event.preventDefault();

    const memberId = sessionStorage.getItem("memberId");
    const totpCode = document.getElementById("totpCode").value;

    try {
        const response = await axios.post(`/api/admin/2fa/verify`, null, {
            params: {
                memberId: memberId,
                code: totpCode
            }
        });

        console.log("2FA 인증 성공:", response.data);

        setTimeout(() => {
            window.location.href = "/";
        }, 500);
    } catch (error) {
        console.error("TOTP 인증 실패:", error);
        Swal.fire({
            icon: 'error',
            title: 'OTP 인증 실패',
            text: '다시 시도해주세요.'
        });
    }
}
*/
