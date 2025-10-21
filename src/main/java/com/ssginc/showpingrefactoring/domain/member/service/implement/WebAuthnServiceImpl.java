package com.ssginc.showpingrefactoring.domain.member.service.implement;

import com.ssginc.showpingrefactoring.domain.member.entity.AdminDeviceStatus;
import com.ssginc.showpingrefactoring.domain.member.repository.AdminDeviceRepository;
import com.ssginc.showpingrefactoring.domain.member.service.WebAuthnService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class WebAuthnServiceImpl implements WebAuthnService {

    private final AdminDeviceRepository deviceRepo;
    private final StringRedisTemplate redis;

    @Value("${redis.prefix:sp:mfa:}") private String prefix;
    @Value("${mfa.webauthnChallengeTtlSeconds:120}") private int challengeTtl;
    @Value("${webauthn.rp.id:localhost}") private String rpId;

    @Override
    public Map<String, Object> assertionOptions(Long memberNo) {
        byte[] challenge = UUID.randomUUID().toString().getBytes();
        String chal = Base64.getUrlEncoder().withoutPadding().encodeToString(challenge);
        redis.opsForValue().set(prefix + "webauthn:chal:" + memberNo, chal, Duration.ofSeconds(challengeTtl));

        var allow = new ArrayList<Map<String,Object>>();
        deviceRepo.findAllByMember_MemberNoAndStatus(memberNo, AdminDeviceStatus.APPROVED)
                .forEach(d -> allow.add(Map.of(
                        "type","public-key",
                        "id", Base64.getUrlEncoder().withoutPadding().encodeToString(d.getCredentialId())
                )));

        return Map.of(
                "challenge", chal,
                "rpId", rpId,
                "allowCredentials", allow,
                "userVerification", "preferred"
        );
    }

    @Override
    public UUID verifyAssertion(Long memberNo, byte[] rawId, byte[] authenticatorData, byte[] clientDataJSON, byte[] signature) {
        // TODO: webauthn4j 로 검증 교체
        var dev = deviceRepo.findByCredentialId(rawId)
                .orElseThrow(() -> new IllegalArgumentException("Unknown device"));
        if (!Objects.equals(dev.getMember().getMemberNo(), memberNo))
            throw new IllegalArgumentException("Device not bound to member");
        if (dev.getStatus() != AdminDeviceStatus.APPROVED)
            throw new IllegalStateException("Device not approved");

        dev.setLastSeenAt(Instant.now());
        deviceRepo.save(dev);
        return dev.getId();
    }
}
