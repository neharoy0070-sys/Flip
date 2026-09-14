package com.finshield.ai.voice.speech;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AudioStore {

    private final Map<String, byte[]> store = new ConcurrentHashMap<>();

    public String save(byte[] audio) {
        String id = UUID.randomUUID().toString();
        store.put(id, audio);
        return id;
    }

    public byte[] get(String id) {
        return store.get(id);
    }
}
