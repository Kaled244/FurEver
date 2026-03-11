package com.furever.webapplication.FurEver.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

   @Override
protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain) throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");

    // 1. IF NO TOKEN: Just move to the next filter. 
    // This allows public endpoints (like GET /api/pets) to work for guests.
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }

    final String jwt = authHeader.substring(7);

    // 2. Handle cases where frontend might send "null" or "undefined" as a string
    if (jwt.equalsIgnoreCase("undefined") || jwt.equalsIgnoreCase("null") || jwt.isBlank()) {
        filterChain.doFilter(request, response);
        return;
    }

    try {
        final String username = jwtService.extractUsername(jwt);

        // 3. If we have a username and the user isn't already authenticated in this request
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Extract the role from the token
            String role = jwtService.extractRole(jwt);
            
            // Format the role: Spring .hasRole("ADMIN") expects "ROLE_ADMIN" in the authorities list
            String formattedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority(formattedRole))
            );

            // Set request details (IP, session ID, etc.)
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            // FINALLY: Put the user in the security context
            SecurityContextHolder.getContext().setAuthentication(authToken);
            
            System.out.println("✅ User authenticated: " + username + " with role: " + formattedRole);
        }
    } catch (Exception e) {
        // If the token is expired or fake, we DON'T block the request here.
        // We just don't authenticate the user. 
        // If they are trying to access a private route, the FilterChain will block them later.
        System.err.println("❌ JWT Validation failed: " + e.getMessage());
        SecurityContextHolder.clearContext();
    }

    // 4. ALWAYS call this at the end to keep the request moving!
    filterChain.doFilter(request, response);
}
}