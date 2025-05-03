package com.ssginc.showpingrefactoring.domain.member.dto;

import lombok.Getter;

@Getter
public class UpdateMemberRequestDto {
    private String memberName;
    private String password;
    private String address;
}
