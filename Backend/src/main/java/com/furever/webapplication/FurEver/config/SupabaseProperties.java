package com.furever.webapplication.FurEver.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for Supabase integration
 * Registers custom properties so Spring Boot recognizes them
 */
@Component
@ConfigurationProperties(prefix = "supabase")
public class SupabaseProperties {
    private String url;
    private String apiKey;
    private String bucket;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getBucket() {
        return bucket;
    }

    public void setBucket(String bucket) {
        this.bucket = bucket;
    }
}
