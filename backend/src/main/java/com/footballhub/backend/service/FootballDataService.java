package com.footballhub.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class FootballDataService {

    private final RestClient restClient;
    private final String apiToken;

public FootballDataService(
        @Value("${football-data.api-token}") String apiToken) {

    this.restClient = RestClient.builder()
            .baseUrl("https://api.football-data.org/v4")
            .build();

    this.apiToken = apiToken;
}

    public String getPremierLeagueMatches() {
        return restClient.get()
                .uri("/competitions/PL/matches?season=2026")
                .header("X-Auth-Token", apiToken)
                .retrieve()
                .body(String.class);
    }
}