package com.app.studenttracker.service;

import com.app.studenttracker.dto.ItemDto;
import com.app.studenttracker.model.Item;
import com.app.studenttracker.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<ItemDto> getAllItems() {
        return itemRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ItemDto getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        return convertToDto(item);
    }

    public ItemDto createItem(ItemDto itemDto) {
        Item item = new Item();
        item.setName(itemDto.getName());
        item.setDescription(itemDto.getDescription());
        item.setPrice(itemDto.getPrice());
        
        Item savedItem = itemRepository.save(item);
        return convertToDto(savedItem);
    }

    public ItemDto updateItem(Long id, ItemDto itemDto) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        
        item.setName(itemDto.getName());
        item.setDescription(itemDto.getDescription());
        item.setPrice(itemDto.getPrice());
        
        Item updatedItem = itemRepository.save(item);
        return convertToDto(updatedItem);
    }

    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }

    private ItemDto convertToDto(Item item) {
        ItemDto dto = new ItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        return dto;
    }
}
