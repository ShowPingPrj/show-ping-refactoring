package com.ssginc.showpingrefactoring.domain.member.service;

import com.ssginc.showpingrefactoring.domain.member.dto.LoginRequestDto;
import com.ssginc.showpingrefactoring.domain.member.dto.LoginResponseDto;
import com.ssginc.showpingrefactoring.domain.member.dto.ReissueRequestDto;
import com.ssginc.showpingrefactoring.domain.member.dto.TokenResponseDto;

public interface AuthService {
    LoginResponseDto login(LoginRequestDto request);
    TokenResponseDto reissue(ReissueRequestDto request);
    void logout(String memberId);

    // 🔹 AccessToken에서 memberId 추출
    String getMemberIdFromToken(String token);
}
