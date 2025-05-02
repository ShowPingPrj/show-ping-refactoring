package com.ssginc.showpingrefactoring.domain.stream.service;

import com.ssginc.showpingrefactoring.domain.stream.dto.request.RegisterLiveRequestDto;
import com.ssginc.showpingrefactoring.domain.stream.dto.response.GetLiveProductInfoResponseDto;
import com.ssginc.showpingrefactoring.domain.stream.dto.response.GetLiveRegisterInfoResponseDto;
import com.ssginc.showpingrefactoring.domain.stream.dto.response.StartLiveResponseDto;
import com.ssginc.showpingrefactoring.domain.stream.dto.response.StreamResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface LiveService {

    GetLiveProductInfoResponseDto getStreamProductInfo(Long streamNo);

    StreamResponseDto getLive();

    Page<StreamResponseDto> getAllBroadCastByPage(Pageable pageable);

    Page<StreamResponseDto> getAllStandbyByPage(Pageable pageable);

    Long createStream(String memberId, RegisterLiveRequestDto request);

    StartLiveResponseDto startStream(Long streamNo);

    Boolean stopStream(Long streamNo);

    GetLiveRegisterInfoResponseDto getStreamRegisterInfo(String memberId);

}
