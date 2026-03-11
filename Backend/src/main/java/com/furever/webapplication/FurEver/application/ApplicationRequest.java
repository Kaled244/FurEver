package com.furever.webapplication.FurEver.application;

public record ApplicationRequest(
        Integer petId,
        String appContact,
        String appHomeType,
        ExperienceLevel appExperience,
        String appNewpetname,
        String appAnswer
) {}