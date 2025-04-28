package com.ssginc.showpingrefactoring.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberDto {
    private String memberId;
    private String memberName;
    private String email;
    private String phone;
    private String address;
}
