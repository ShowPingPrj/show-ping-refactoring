package com.ssginc.showpingrefactoring.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomErrorResponse {

    private final String code;

    private final String message;

    public static CustomErrorResponse of(String code, String message) {
        return new CustomErrorResponse(code, message);
    }

}
