package com.footballhub.backend.controller;

import com.footballhub.backend.service.FootballDataService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "http://localhost:5173")
public class MatchController {

    private final FootballDataService footballDataService;

    public MatchController(FootballDataService footballDataService) {
        this.footballDataService = footballDataService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public String getMatches() {
        return footballDataService.getPremierLeagueMatches();
    }
}