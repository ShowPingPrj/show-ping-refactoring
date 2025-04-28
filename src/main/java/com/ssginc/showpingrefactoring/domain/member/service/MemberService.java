package com.ssginc.showpingrefactoring.domain.member.service;


import com.ssginc.showpingrefactoring.domain.member.dto.SignupRequestDto;
import com.ssginc.showpingrefactoring.domain.member.dto.UpdateMemberRequestDto;
import com.ssginc.showpingrefactoring.domain.member.dto.MemberDto;

public interface MemberService {
    void signup(SignupRequestDto request);

    MemberDto getMemberInfo(String memberId);

    void updateMember(String memberId, UpdateMemberRequestDto request);

    void deleteMember(String memberId);
}
