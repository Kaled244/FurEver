package com.furever.webapplication.FurEver.user;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    // Constructor Injection (fixes the "Field injection" warning)
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // This "unwraps" the Optional so the Controller can use it easily
    public UserEntity findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public UserEntity saveUser(UserEntity user) {
        return userRepository.save(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}