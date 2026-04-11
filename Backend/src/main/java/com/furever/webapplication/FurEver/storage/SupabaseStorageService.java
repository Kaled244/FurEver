package com.furever.webapplication.FurEver.storage; // Double check this package matches your folder

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.api-key}") // This matches your application.properties key
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucketName;

    public String uploadImage(MultipartFile file) throws Exception {
        // 1. Create a unique file name (e.g., 550e8400-e29b.jpg)
        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains(".")) 
                           ? originalFilename.substring(originalFilename.lastIndexOf("."))
                           : ".jpg";
        String fileName = UUID.randomUUID().toString() + extension;

        // 2. Build the Supabase Storage URL
        // Format: https://project.supabase.co/storage/v1/object/Avatar/filename.jpg
        String url = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;

        // 3. Set Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(supabaseKey);
        headers.set("apikey", supabaseKey);
        String rawContentType = file.getContentType();
        String contentType = rawContentType != null ? rawContentType : "application/octet-stream";
        headers.setContentType(MediaType.parseMediaType(contentType));

        // 4. Send the Request
        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);
        
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            // 5. Return the Public URL
            return supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + fileName;
        } else {
            throw new RuntimeException("Supabase upload failed: " + response.getBody());
        }
    }
}