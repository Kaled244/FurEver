package com.furever.webapplication.FurEver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.origins:http://localhost:5173}")
    private String corsOrigins;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**", "/api/health/**").permitAll()

                        .requestMatchers("/", "/index.html").permitAll()
                        .requestMatchers("/api/auth/**", "/api/health/**").permitAll()

                        // User Protected Routes
                        .requestMatchers("/api/pets/my-pets").authenticated()
                        .requestMatchers("/api/profile/**").authenticated()
                        .requestMatchers("/api/applications/**").authenticated()

                        // --- ADMIN CONSOLIDATED RULES ---
                        // We use hasRole("ADMIN") because your Filter adds the "ROLE_" prefix already!
                        .requestMatchers(HttpMethod.POST, "/api/pets/add").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/pets/update/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/pets/**").hasRole("ADMIN")

                        // --- PUBLIC GET RULES ---
                        // Allow everyone to see pets and the uploaded images
                        .requestMatchers(HttpMethod.GET, "/api/pets", "/api/pets/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll() // Ensure static images are public

                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // This pulls from the Render variable we just set
        List<String> origins = Arrays.asList(corsOrigins.split(","));
        configuration.setAllowedOrigins(origins);

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Change this line to allow all headers to prevent "Header not allowed" 403s
        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}