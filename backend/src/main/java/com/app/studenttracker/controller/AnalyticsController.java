package com.app.studenttracker.controller;

import com.app.studenttracker.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000") // Assuming React default port
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/productivity/{studentId}")
    public ResponseEntity<Map<String, Double>> getProductivity(@PathVariable Long studentId) {
        double score = analyticsService.calculateProductivity(studentId);
        Map<String, Double> response = new HashMap<>();
        response.put("productivity_score", score);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/trends/{studentId}")
    public ResponseEntity<Map<String, Integer>> getTrends(@PathVariable Long studentId) {
        Map<String, Integer> trend = analyticsService.getWeeklyTrend(studentId);
        return ResponseEntity.ok(trend);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Map<String, Object>>> getAdminDashboard() {
        List<Map<String, Object>> dashboard = analyticsService.getAdminDashboard();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/predict/{studentId}")
    public ResponseEntity<Map<String, Integer>> predictRisk(@PathVariable Long studentId) {
        int risk = analyticsService.predictRisk(studentId);
        Map<String, Integer> response = new HashMap<>();
        response.put("at_risk", risk);
        return ResponseEntity.ok(response);
    }
}
