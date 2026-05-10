package com.app.studenttracker.controller;

import com.app.studenttracker.dto.AdminReportDto;
import com.app.studenttracker.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/report")
    public ResponseEntity<AdminReportDto> getReport() {
        return ResponseEntity.ok(adminService.getReport());
    }
}
