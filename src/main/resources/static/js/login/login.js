document.addEventListener("DOMContentLoaded", async () => {
    const authButton = document.getElementById("auth-button");
    const authIcon = document.getElementById("auth-icon");

    try {
        const res = await fetch("/api/auth/user-info", {
            credentials: "include"
        });

        if (res.ok) {
            const data = await res.json();
            authButton.href = "#";
            authIcon.src = "/img/icon/logout.png";
            authButton.addEventListener("click", e => {
                e.preventDefault();
                logout();
            });

            // 관리자 메뉴 표시
            if (data.role === "ADMIN") {
                document.getElementById("admin-menu").hidden = false;
            }
        } else {
            throw new Error();
        }
    } catch {
        authButton.href = "/login";
        authIcon.src = "/img/icon/login.png";
    }
});

// 로그인 함수 (현재는 일단 관리자 사용자 할것없이 바로 로그인)
async function login(event) {
    event.preventDefault();

    const memberId = document.getElementById("memberId").value;
    const password = document.getElementById("memberPassword").value;

    try {
        const response = await axios.post("/api/auth/login", {
            memberId,
            password
        }, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        });

        if (response.data.memberRole) {
            Swal.fire({
                icon: "success",
                title: "로그인 성공",
                text: `${response.data.memberRole} 권한으로 로그인됨`
            }).then(() => {
                location.href = "/";
            });
        }
    } catch (error) {
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
