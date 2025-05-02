package com.ssginc.showpingrefactoring.product.service;

import jakarta.transaction.Transactional;
import java.util.List;
import com.ssginc.showpingrefactoring.product.dto.request.OrderRequestDto;
import com.ssginc.showpingrefactoring.product.dto.response.OrderDetailDto;
import com.ssginc.showpingrefactoring.product.dto.response.OrdersDto;

public interface OrderService {
    List<OrdersDto> findAllOrdersByMember(Long memberNo);

    List<OrderDetailDto> findOrderDetailsByOrder(Long orderNo);

    @Transactional
    void createOrder(OrderRequestDto orderRequestDto);
}
