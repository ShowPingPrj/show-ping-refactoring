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

        if (response.data.status === "LOGIN_SUCCESS") {
            console.log("로그인 성공!");
            if (response.data.accessToken) {
                sessionStorage.setItem("accessToken", response.data.accessToken);
                console.log("Access Token 저장 완료:", sessionStorage.getItem("accessToken"));
            }

            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        } else {
            alert("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
        }
    } catch (error) {
        console.error("로그인 요청 실패:", error.response ? error.response.data : error);
        alert("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
    }
}
// ✅ TOTP (2단계 인증) 검증 함수
// async function verifyTOTP(event) {
//     event.preventDefault();
//
//     const memberId = sessionStorage.getItem("memberId");
//     const totpCode = document.getElementById("totpCode").value;
//
//     try {
//         const response = await axios.post(`/api/admin/2fa/verify`, null, {
//             params: {
//                 memberId: memberId,
//                 code: totpCode
//             }
//         });
//
//         console.log("2FA 인증 성공:", response.data);
//
//         setTimeout(() => {
//             window.location.href = "/";
//         }, 500);
//     } catch (error) {
//         console.error("TOTP 인증 실패:", error);
//         alert("OTP 인증 실패! 다시 시도하세요.");
//     }
// }

// ✅ QR 코드 가져오는 함수 (2FA 활성화 시 사용)
// async function fetchQrCode(adminId) {
//     try {
//         const response = await axios.get(`/api/admin/2fa/setup`, {
//             params: { memberId: adminId }
//         });
//
//         document.getElementById("qrCodeImage").src =
//             `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(response.data)}`;
//         document.getElementById("totp-form").style.display = "block";
//     } catch (error) {
//         console.error("QR 코드 로드 오류:", error);
//         Swal.fire({
//             icon: 'error',
//             title: 'QR 코드 오류',
//             text: 'QR 코드 로드 중 오류 발생!'
//         });
//     }
// }

// 🔹 뒤로가기 방지 함수
// function preventBackNavigation() {
//     history.pushState(null, null, location.href);
//     window.onpopstate = function () {
//         history.go(1);
//     };
// }