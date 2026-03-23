package com.furever.webapplication.FurEver.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for JWT (FurEver)
 * Registers custom properties so Spring Boot recognizes them
 */
@Component
@ConfigurationProperties(prefix = "furever.jwt")
public class JwtProperties {
    private String secret;
    private long expiration;
    private long refreshExpiration;

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }

    public long getRefreshExpiration() {
        return refreshExpiration;
    }

    public void setRefreshExpiration(long refreshExpiration) {
        this.refreshExpiration = refreshExpiration;
    }
}
