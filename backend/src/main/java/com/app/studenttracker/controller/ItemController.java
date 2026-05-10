package com.app.studenttracker.controller;

import com.app.studenttracker.dto.ItemDto;
import com.app.studenttracker.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173") // Vite default port
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<List<ItemDto>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(itemService.getItemById(id));
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<ItemDto> createItem(@Valid @RequestBody ItemDto itemDto) {
        return new ResponseEntity<>(itemService.createItem(itemDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody ItemDto itemDto) {
        try {
            return ResponseEntity.ok(itemService.updateItem(id, itemDto));
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Item deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
