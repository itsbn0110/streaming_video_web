package dev.streaming.upload.services;

<<<<<<< HEAD
import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
=======
import java.util.HashSet;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PostAuthorize;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
<<<<<<< HEAD
import org.springframework.web.multipart.MultipartFile;
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52

import dev.streaming.upload.DTO.request.UpdateRequest;
import dev.streaming.upload.DTO.request.UserCreationRequest;
import dev.streaming.upload.DTO.response.UserResponse;
import dev.streaming.upload.Entity.Role;
import dev.streaming.upload.Entity.User;
<<<<<<< HEAD
=======
import dev.streaming.upload.constant.PredefinedRole;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.mapper.UserMapper;
import dev.streaming.upload.repository.RoleRepositiory;
import dev.streaming.upload.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    RoleRepositiory roleRepository;
<<<<<<< HEAD
    CloudinaryService cloudinaryService;
    public UserResponse createUser(UserCreationRequest request,MultipartFile avatarFile) throws IOException {
        // userRepository.findByusername(request.getUsername()).orElseThrow(() ->  new AppException(ErrorCode.USER_ALREADY_EXISTED));
        
=======

    public UserResponse createUser(UserCreationRequest request) {
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        HashSet<Role> roles = new HashSet<>();
<<<<<<< HEAD
        Optional<Role> userRole = roleRepository.findById(request.getRole());
        if (userRole.isPresent()) {
            roles.add(userRole.get());
        } else {
            throw new RuntimeException("Role not found!");
        }

        user.setRoles(roles);
        var avatar = cloudinaryService.uploadImage(avatarFile);

        user.setAvatar(avatar);
        
=======
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        user.setRoles(roles);
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52

        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_ALREADY_EXIST);
        }

        return userMapper.toUserResponse(user);
    }

<<<<<<< HEAD
    

    @PreAuthorize(value = "hasRole('ADMIN')")
    public Page<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAll(pageable);
    
        Page<UserResponse> responsePage = users.map(user -> userMapper.toUserResponse(user));
    
        return responsePage;
    }

  
=======
    @PreAuthorize(value = "hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @PostAuthorize("returnObject.username == authentication.name")
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    public UserResponse getUserById(String userId) {
        log.info("in getuser by id");
        return userMapper.toUserResponse(
                userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!!")));
    }

    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByusername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

<<<<<<< HEAD
    public UserResponse updateUser(UpdateRequest request, MultipartFile avatarFile, String userId) {
        User existedUser = userRepository.findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        
        userMapper.updateFromRequest(request, existedUser);
        
        var roles = roleRepository.findAll().stream()
            .filter(role -> role.getName().equals(request.getRole()))
            .collect(Collectors.toSet());
            existedUser.setRoles(new HashSet<>(roles));
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existedUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        
        if (avatarFile != null && !avatarFile.isEmpty()) {
            try {
                var avatar = cloudinaryService.uploadImage(avatarFile);
                existedUser.setAvatar(avatar);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload avatar", e);
            }
        }
        
        return userMapper.toUserResponse(userRepository.save(existedUser));
    }

    public void deleteUser(String userId) 
    {   
        var existedUser = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        existedUser.getRoles().clear();
=======
    public UserResponse updateUser(UpdateRequest request, String userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("not found"));

        userMapper.updateUser(user, request);

        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(String userId) {
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
        userRepository.deleteById(userId);
    }
}
