package com.ssginc.showpingrefactoring.domain.stream.service;

import com.ssginc.showpingrefactoring.common.exception.CustomException;
import com.ssginc.showpingrefactoring.domain.stream.dto.response.StreamResponseDto;
import com.ssginc.showpingrefactoring.domain.stream.repository.VodRepository;
import com.ssginc.showpingrefactoring.domain.stream.service.implement.VodServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class VodServiceTest {
    @Mock
    private VodRepository vodRepository;

    @InjectMocks
    private VodServiceImpl vodService;

    @Test
    void findVods_mostViewedAndCategoryExists_returnsPage() {
        // given
        Long categoryNo = 1L;
        String sort = "mostViewed";
        Pageable pageable = PageRequest.of(0, 4);
        Page<StreamResponseDto> mockPage = new PageImpl<>(List.of(new StreamResponseDto()), pageable, 1);

        when(vodRepository.findByCategoryIdOrderByViewsDesc(categoryNo, pageable)).thenReturn(mockPage);

        // when
        Page<StreamResponseDto> result = vodService.findVods(categoryNo, sort, pageable);

        // then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(vodRepository).findByCategoryIdOrderByViewsDesc(categoryNo, pageable);
    }

    @Test
    void findVods_emptyResult_throwsCustomException() {
        // given
        Long categoryNo = 0L;
        String sort = "default";
        Pageable pageable = PageRequest.of(0, 4);
        Page<StreamResponseDto> emptyPage = new PageImpl<>(List.of(), pageable, 0);

        when(vodRepository.findAllVod(pageable)).thenReturn(emptyPage);

        // when & then
        assertThrows(CustomException.class, () -> vodService.findVods(categoryNo, sort, pageable));
    }
}
