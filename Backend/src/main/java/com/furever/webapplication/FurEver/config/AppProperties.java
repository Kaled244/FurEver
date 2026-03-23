package com.furever.webapplication.FurEver.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for FurEver application
 * Registers custom properties so Spring Boot recognizes them
 */
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private Cors cors = new Cors();

    public static class Cors {
        private String origins;

        public String getOrigins() {
            return origins;
        }

        public void setOrigins(String origins) {
            this.origins = origins;
        }
    }

    public Cors getCors() {
        if (cors == null) {
            cors = new Cors();
        }
        return cors;
    }

    public void setCors(Cors cors) {
        this.cors = cors;
    }
}
