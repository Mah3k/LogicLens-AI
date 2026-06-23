package com.logiclens.backend.service;

import com.logiclens.backend.model.User;
import java.util.List;

public interface UserService {
    User createUser(User user);
    List<User> getAllUsers();
    String loginUser(String email, String password);
}
