package com.ssginc.showpingrefactoring.product.dto.request;

import lombok.Data;

@Data
public class CartRequestDto {
    private Long productNo;
    private Long quantity;
}
