package com.ssginc.showpingrefactoring.domain.member.controller;

import com.ssginc.showpingrefactoring.domain.member.dto.SignupRequestDto;
import com.ssginc.showpingrefactoring.domain.member.dto.UpdateMemberRequestDto;
import com.ssginc.showpingrefactoring.domain.member.dto.MemberDto;
import com.ssginc.showpingrefactoring.common.jwt.JwtTokenProvider;
import com.ssginc.showpingrefactoring.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 회원 가입
     */
    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody SignupRequestDto request) {
        memberService.signup(request);
        return ResponseEntity.ok().build();
    }

    /**
     * 회원 정보 조회 (내 정보)
     */
    @GetMapping("/me")
    public ResponseEntity<MemberDto> getMyInfo(HttpServletRequest request) {
        String memberId = getMemberIdFromRequest(request);
        MemberDto memberDto = memberService.getMemberInfo(memberId);
        return ResponseEntity.ok(memberDto);
    }

    /**
     * 회원 정보 수정
     */
    @PutMapping("/me")
    public ResponseEntity<Void> updateMyInfo(@RequestBody UpdateMemberRequestDto request, HttpServletRequest httpRequest) {
        String memberId = getMemberIdFromRequest(httpRequest);
        memberService.updateMember(memberId, request);
        return ResponseEntity.ok().build();
    }

    /**
     * 회원 탈퇴
     */
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount(HttpServletRequest request) {
        String memberId = getMemberIdFromRequest(request);
        memberService.deleteMember(memberId);
        return ResponseEntity.ok().build();
    }

    /**
     * AccessToken에서 memberId 추출 (Authorization 헤더 사용)
     */
    private String getMemberIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // 여기는 JwtTokenProvider를 직접 주입하거나, 서비스에서 따로 빼야 해
            // 여기서는 MemberController에 JwtTokenProvider 추가 주입한다고 가정할게
            return jwtTokenProvider.getUsername(token);
        }
        throw new RuntimeException("No Authorization Header Found");
    }
}
