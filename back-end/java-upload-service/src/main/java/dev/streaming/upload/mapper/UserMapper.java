package dev.streaming.upload.mapper;

<<<<<<< HEAD
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
=======
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52

import dev.streaming.upload.DTO.request.UpdateRequest;
import dev.streaming.upload.DTO.request.UserCreationRequest;
import dev.streaming.upload.DTO.response.UserResponse;
import dev.streaming.upload.Entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(UserCreationRequest request);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UpdateRequest request);
    // UserResponse toUserResponse (User user);
    UserResponse toUserResponse(User user);
<<<<<<< HEAD

     @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(UpdateRequest request, @MappingTarget User user);
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
}
