package com.furever.webapplication.FurEver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Refresh Token Service for mobile apps
 * Enables token rotation: short-lived access tokens + long-lived refresh tokens
 */
@Service
public class RefreshTokenService {

    @Value("${furever.jwt.refresh-expiration:2592000}")
    private long refreshTokenExpiration; // 30 days by default

    private final JwtService jwtService;
    
    // Simple in-memory store (use Redis for production)
    private final Map<String, String> refreshTokenStore = new ConcurrentHashMap<>();

    public RefreshTokenService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    /**
     * Generate both access token and refresh token
     */
    public Map<String, Object> generateTokenPair(String username, String role) {
        // Short-lived access token (optional - default is 24h, adjust in JwtService if needed)
        String accessToken = jwtService.generateToken(username, role);
        
        // Long-lived refresh token
        String refreshToken = jwtService.generateRefreshToken(username);
        
        // Store refresh token for validation
        refreshTokenStore.put(refreshToken, username);

        Map<String, Object> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("expiresIn", 86400); // 24 hours in seconds
        tokens.put("tokenType", "Bearer");
        
        return tokens;
    }

    /**
     * Validate refresh token and generate new access token
     * Used when access token expires
     */
    public String refreshAccessToken(String refreshToken) {
        String username = refreshTokenStore.get(refreshToken);
        
        if (username == null) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        // Validate refresh token signature
        try {
            String tokenUsername = jwtService.extractUsername(refreshToken);
            if (!tokenUsername.equals(username)) {
                throw new RuntimeException("Refresh token mismatch");
            }
        } catch (Exception e) {
            refreshTokenStore.remove(refreshToken);
            throw new RuntimeException("Invalid refresh token: " + e.getMessage());
        }

        // Return new access token
        String role = jwtService.extractRole(refreshToken);
        return jwtService.generateToken(username, role);
    }

    /**
     * Logout: invalidate refresh token
     */
    public void revokeRefreshToken(String refreshToken) {
        refreshTokenStore.remove(refreshToken);
    }

    /**
     * Check if refresh token is valid
     */
    public boolean isRefreshTokenValid(String refreshToken) {
        try {
            return refreshTokenStore.containsKey(refreshToken) && 
                   !jwtService.isTokenExpired(refreshToken);
        } catch (Exception e) {
            return false;
        }
    }
}
