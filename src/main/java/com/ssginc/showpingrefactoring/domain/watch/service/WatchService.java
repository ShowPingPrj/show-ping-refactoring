package com.ssginc.showpingrefactoring.domain.watch.service;

import com.ssginc.showpingrefactoring.domain.watch.dto.request.WatchRequestDto;
import com.ssginc.showpingrefactoring.domain.watch.dto.response.WatchResponseDto;
import com.ssginc.showpingrefactoring.domain.watch.entity.Watch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface WatchService {

    List<WatchResponseDto> getWatchHistoryByMemberNo(Long memberNo);

    Watch insertWatchHistory(WatchRequestDto watchRequestDto, Long memberNo);

    Page<WatchResponseDto> getWatchHistoryPage(Long memberNo, Pageable pageable);

}
